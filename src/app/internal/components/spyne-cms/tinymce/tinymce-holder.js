import { ChannelPayloadFilter, ViewStream } from "spyne";
import { TinymceView } from "./tinymce-view";
import Tmpl from './templates/tinymce-holder.tmpl.html'
export class TinymceHolder extends ViewStream {
  constructor(props = {}) {
    props.id='tinymce-holder';
    props.class='reveal';
    props.template = Tmpl;
    props.channels = ["CHANNEL_UI", "CHANNEL_TINYMCE"]
    super(props);
  }


  addActionListeners() {
    const typeFilter = new ChannelPayloadFilter({
      panelEventType: "tinymce"
    })

    return [
      ["CHANNEL_TINYMCE_CLOSE_TINYMCE_EVENT", "closeTinymce"],
      ["CHANNEL_TINYMCE_EDIT_RICH_TEXT_EVENT", "openTinymce"]
/*
      ["CHANNEL_UI_CLICK_EVENT", "onTinymceEvent", typeFilter]
*/
    ];
  }

  onTinymceEvent(e){
    const {payload} = e;
    const {type, panelEventType} = payload;

    const revealBool = type !== "tinymce-close";

    console.log('payload is ',{payload,type, panelEventType, e})

    this.addRevealClass(revealBool)
  }

  addRevealClass(revealBool=true){
    this.props.el$.toggleClass('reveal', revealBool);

  }

  openTinymce(){
    this.addRevealClass();

  }

  closeTinymce(){
    this.addRevealClass(false);
  }

  broadcastEvents() {
    return [
      ['button.tinymce-ui-btn', 'click']
    ];
  }

  onRendered() {
    window.setTimeout(this.closeTinymce.bind(this), 30);

    this.appendView(new TinymceView(), '.tinymce-panel');



  }
}
