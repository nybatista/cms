import { ViewStream, ChannelPayloadFilter } from 'spyne';
import {TinymceTraits} from "../../../traits/tinymce-traits";
import tinymce from 'tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import 'tinymce/icons/default';
import 'tinymce/plugins/code';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/pagebreak';
import 'tinymce/skins/ui/oxide-dark/skin';
import 'tinymce/skins/ui/oxide-dark/content';
import 'tinymce/skins/content/default/content'


// TinyMCE core
/*import oxideSkinCss from 'tinymce/skins/ui/oxide/skin.css';
import oxideContentCss from 'tinymce/skins/ui/oxide/content.css';
import defaultContentCss from 'tinymce/skins/content/default/content.css';
import 'tinymce/icons/default/icons.js';
import 'tinymce/themes/silver/theme.js';
import 'tinymce/models/dom/model.js';*/

// Plugins (from your error list)
import 'tinymce/plugins/preview';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/charmap/plugin';
import 'tinymce/plugins/wordcount/plugin';
import 'tinymce/plugins/table/plugin';



///import 'tinymce/plugins/licensekeymanager';

export class TinymceView extends ViewStream {
  constructor(props = {}) {
    props.id = 'tinymce-view';
    props.channels = ["CHANNEL_UI", "CHANNEL_TINYMCE"];
    props.traits = [TinymceTraits];
    props.template = `<textarea></textarea>`
    super(props);
  }

  broadcastEvents() {
    return [
/*
      ['textarea', 'keyup']
*/


    ];
  }

  addActionListeners() {
    const typeFilter = new ChannelPayloadFilter({
      type: "edit-string"
    })

    return [
      ["CHANNEL_TINYMCE_EDIT_RICH_TEXT_EVENT", "tinymce$OnRichTextEdit"],
      ["CHANNEL_TINYMCE_CLOSE_TINYMCE_EVENT", "tinymce$OnCloseWindow"],

      ["CHANNEL_UI_CLICK_EVENT", "onRichTextEdit", typeFilter]

    ];
  }

  onRichTextEdit(e){
    const {payload, srcElement} = e;
    const {propertyId} = payload;
    //const textArea = document.querySelector(`#${propertyId} textarea`);

    //console.log("edit string ", {propertyId, tinymce,payload, srcElement});

    this.tinymce$ConnectToCMSTextArea(propertyId);

    //tinymce.setActive(textArea);


  }

  onRendered() {


    const onTinyLoaded = (e)=>{

      this.props.tinymce$ = tinymce.activeEditor;

      //console.log('tiny loaded ',this.props.tinymce$,{tinymce, e});

    }

    //this.addTiny2(onTinyLoaded);
    const delayer = ()=>this.addTiny(onTinyLoaded, this.tinymce$ActiveEditorOnKeyup.bind(this));
    window.setTimeout(delayer, 100);
  }
  addTiny(callbackFn, keyupCallBackFn) {


    const baseURL = "./tinymce";// getTinyMCEBaseURL();


    tinymce.init({
      selector: "#tinymce-view textarea",
      convert_fonts_to_spans: false,
      valid_elements: '*[*]',     // accept any element
      extended_valid_elements: '*[*]',
      valid_children: '+body[*]', // prevent TinyMCE from auto-nesting content
      license_key: 'gpl',
      base_url: baseURL,          // ✅ always absolute
      suffix: '.min',

      importcss_append: true,
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',

      noneditable_noneditable_class: 'mceNonEditable',
      toolbar_mode: 'sliding',
      contextmenu: 'link',
      skin: 'oxide-dark',
      end_container_on_empty_block: "div,p,a,strong",
      nowrap: true,
      content_css:  'default',


      convert_urls: false,
      autosave_ask_before_unload: true,
      autosave_interval: '30s',
      autosave_prefix: '{path}{query}-{id}-',
      autosave_restore_when_empty: false,
      autosave_retention: '2m',
      image_advtab: true,

      setup: (editor) => {
        // Run your provided init callback and keyup handlers
        editor.on('init', callbackFn);
        editor.on('keyup', keyupCallBackFn);
        //this.tinymce$OnBlurEditor(editor);
      },

      plugins: [
        'autolink', 'link', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'visualchars',
        'code', 'fullscreen', 'insertdatetime', 'table'
      ],

      toolbar: [
        'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify |',
        'bullist numlist outdent indent | link image | print preview media fullscreen |',
        'forecolor backcolor emoticons | help'
      ].join(' '),

      menu: {
        favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
      },

      menubar: 'favs file edit view insert format tools table help',

    });
  }
}
