import { ViewStream } from 'spyne';
import { ModalTraits } from "../../traits/modal-traits";

export class AuthModalHolder extends ViewStream {
  constructor(props = {}) {
    props.traits = [ModalTraits];
    props.channels = ['CHANNEL_MODAL'];
    props.id= 'modal-holder';
    props.class = 'modal-holder modal-holder-auth';
    super(props);
  }

  addActionListeners() {
    return [
      ["CHANNEL_MODAL_OPEN_EVENT", "modal$OnModalOpenEvent"],
      ["CHANNEL_MODAL_CLOSE_EVENT", "onCloseModal"]
    ];
  }

  onCloseModal(){
    const hideModalWindow = ()=>{
      this.props.el$.removeClass('active');
      this.props.el$.removeClass('modal-overlay-exit');
    }

    window.setTimeout(hideModalWindow, 300)

  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
