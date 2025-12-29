import { SpyneTrait, SpyneAppProperties } from 'spyne';
import { UtilTraits } from "./util-traits";

export class TinymceChannelTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'tinymceChannel$';
    super(context, traitPrefix);
  }



  static tinymceChannel$OnDataPanelEvent(e){
    const {payload} = e;

    const {type} = payload;

    const fnHash = {
      "edit-string" : this.tinymceChannel$GetInputToEdit,
      "tinymce-close" : this.tinymceChannel$OnCloseTinymceWindow
    }


    const fn = fnHash[type]

    if (fn){
      fn(e);
    }


  }

  static tinymceChannel$OnCloseTinymceWindow(e, props=this.props){

    const {payload, srcElement} = e;
    const action = "CHANNEL_TINYMCE_CLOSE_TINYMCE_EVENT";

    this.sendChannelPayload(action, payload, srcElement);


  }

  static tinymceChannel$GetInputToEdit(e, props=this.props){
    const {payload} = e;
    const {propertyId} = payload;

    const allowPremiumAccess = SpyneAppProperties.getProp('allowPremiumAccess');
    if (allowPremiumAccess === false){
      return;

    }

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




  static tinymceChannel$HelloWorld() {
    return 'Hello World';
  }
}
