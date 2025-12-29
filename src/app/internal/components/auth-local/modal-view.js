import { ViewStream, ChannelPayloadFilter } from 'spyne';
import { AuthLocalTraits } from "../../traits/auth-local-traits";
import { ModalTraits } from "../../traits/modal-traits";
import ModalTmpl from './templates/modal-view.tmpl.html'


export class ModalView extends ViewStream {
  constructor(props = {}) {
    props.class = 'modal-view modal-view-auth';
   //console.log('data is ',props.data);

    props.channels = ["CHANNEL_AUTH_LOCAL", "CHANNEL_UI", "CHANNEL_MODAL"];
    props.template = ModalTmpl;

    super(props);
  }

  addActionListeners() {


      const payloadFilterOpen = new ChannelPayloadFilter({
        modalEvent: 'open-window',
      })
    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onModalEvent', payloadFilterOpen],
      ["CHANNEL_MODAL_CLOSE_EVENT", "onAnimateOut"]

    ];
  }

  onAnimateOut(){
    const disposeAfterAnim = ()=>this.disposeViewStream();
    this.props.el$.addClass('modal-exit');
    window.setTimeout(disposeAfterAnim, 300);

  }

  onModalEvent(e){
    const { payload } = e;
    const { openWindowUrl } = payload;

    window.open(openWindowUrl, '_blank')
   //console.log('open window is ',payload,e);

  }

  broadcastEvents() {
    return [
      ['button', 'click']
    ];
  }

  onRendered() {
    this.props.el$.addClass('modal-enter');

  }
}
