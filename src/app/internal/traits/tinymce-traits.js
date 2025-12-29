import { SpyneTrait } from 'spyne';
import { UtilTraits } from "./util-traits";

export class TinymceTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'tinymce$';
    super(context, traitPrefix);
  }




  static tinymce$ChannelGetInputToEdit(e, props=this.props){
    const {payload} = e;
    const {propertyId} = payload;

    const textArea = document.querySelector(`#${propertyId} .cms-panel-input.type-property`);

    const  getSrcElement = ()=>{
      const id = textArea.getAttribute('id');
      const {vsid} = textArea.dataset;
      const el = textArea;
      return {el, id, el};

    }
    const {value} = textArea;


    const isPlainText = UtilTraits.util$GetIsPlainText(value);

    const textAreaPayload = {propertyId, value, isPlainText};
    const textAreaSrcElement = getSrcElement();

    this.props.activeCMSInput = textArea;

    const action = "CHANNEL_TINYMCE_EDIT_RICH_TEXT_EVENT";

    this.sendChannelPayload(action, textAreaPayload, textAreaSrcElement);



   //console.log("TEXT AREA FROM CHANNEL IS ", {textAreaPayload, textAreaSrcElement })

  }


  tinymce$OnCloseWindow(){


    if (this.props.isPlainText === true && this.props?.activeCMSInput?.value){
      const {value} =  this.props.activeCMSInput
      const {isPlainText, activeCMSInput} = this.props;
     //console.log("VALUE REPLACE IS ",{value, activeCMSInput, isPlainText})
      const newValue =  value.replace(/^<[^>]+>([\s\S]*)<\/[^>]+>$/, '$1');
      this.props.activeCMSInput.value = newValue

      this.props.tinymce$.setContent(newValue);
    }

  }


  tinymce$OnBlurEditor(editor) {
    // Keep a strong reference to the ViewStream instance
    const view = this;

    editor.on('blur', () => {
      let html = editor.getContent({ format: 'raw' });

      if (view.props.isPlainText) {
        // Strip a single wrapping tag if Tiny added it
        html = html.replace(/^<[^>]+>([\s\S]*)<\/[^>]+>$/, '$1');
      }

      editor.value = html;
      view.props.activeCMSInput.value = html;

     //console.log("EDITOR BLUR VALUE IS ",{html},'edit val ',editor.value, ' cmsInputVal ',  view.props.activeCMSInput.value,  view.props.isPlainText);

      view.tinymce$UpdateCMSInput();

     /* // Update SpyneCMS or broadcast the new value
      if (typeof view.updateCmsField === 'function') {
        view.updateCmsField(html);
      } else {
        // Or optionally trigger a channel broadcast for the CMS sync
        view.broadcast('CHANNEL_CMS_DATA_UPDATE', { key: view.key, value: html });
      }*/
    });
  }


  static tinymce$OnRichTextEdit(e, props=this.props){
    const {payload, srcElement} = e;
    const {el} = srcElement;
    const {value, propertyId, isPlainText} = payload;

   // const textArea =  document.querySelector(`#${propertyId} .cms-panel-input.type-property`);
    this.props.activeCMSInput = el;
    this.props.isPlainText = isPlainText;


    props.tinymce$.setContent(value);

   //console.log("TEXT AREA IS ", props.tinymce$, { value})

  }


  static tinymce$ConnectToCMSTextArea(propertyId, props=this.props){
    const textArea = document.querySelector(`#${propertyId} .cms-panel-input.type-property`);
    this.props.activeCMSInput = textArea;

    const {value} = textArea;

    props.tinymce$.setContent(value);

   //console.log("TEXT AREA IS ", props.tinymce$, {textArea, value})

  }

  static tinymce$ActiveEditorOnKeyup(e, props=this.props){

   //console.log('active editor key up', {e,props},'-----',  tinymce.activeEditor.getContent());
    this.tinymce$UpdateCMSInput();

  }

  static tinymce$UpdateCMSInput(){
    if (this.props.activeCMSInput === undefined ||  tinymce?.activeEditor === undefined){
      console.warn("tinymce$UpdateCMSInput called, but a param(s) is empty");
      return;
    }

    this.props.activeCMSInput.value = tinymce?.activeEditor?.getContent();

   //console.log('update cms input ', this.props.activeCMSInput.value);

    this.props.activeCMSInput.dispatchEvent(new Event('keyup', { bubbles: true }));
    tinymce.activeEditor.focus();

  }

  static tinymce$CleanContent(editor, isPlain) {
    let html = editor.getContent({ format: 'raw' });
    return isPlain ? html.replace(/^<[^>]+>([\s\S]*)<\/[^>]+>$/, '$1') : html;
  }

  static tinymce$HelloWorld() {
    return 'Hello World';
  }
}
