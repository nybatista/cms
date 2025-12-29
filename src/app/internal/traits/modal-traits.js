import { SpyneTrait } from 'spyne';
import { ModalView } from "../components/auth-local/modal-view";

export class ModalTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'modal$';
    super(context, traitPrefix);
  }

  static modal$HelloWorld() {
    return 'Hello World';
  }



  static modal$OnModalOpenEvent(e){
    const {payload} = e;
    const {data} = payload;

    this.props.el$.addClass('active');
    this.props.el$.addClass('modal-overlay-enter');
    this.appendView(new ModalView({data}));


  }

  static modal$OnChannelModalEvent(e){
    const {payload} = e;
    const {modalEvent} = payload;

    const actionHash = {
      'openModal'  : "CHANNEL_MODAL_OPEN_EVENT",
      'closeModal' : "CHANNEL_MODAL_CLOSE_EVENT"
    }

   //console.log("ON MODAL EVENT ",{payload, modalEvent, e})

    if (actionHash[modalEvent]){
      const action = actionHash[modalEvent];
      this.sendChannelPayload(action, payload);
    }


  }



}
