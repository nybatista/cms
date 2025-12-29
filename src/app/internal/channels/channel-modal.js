import { Channel, ChannelPayloadFilter } from 'spyne';
import { ModalTraits } from "../traits/modal-traits";

export class ChannelModal extends Channel {
  constructor(name, props = {}) {
    name = 'CHANNEL_MODAL';
    props.sendCachedPayload = false;
    props.traits = [ModalTraits]
    super(name, props);
  }

  onRegistered() {


    const authPayloadFilter = new ChannelPayloadFilter({
      action: val => ['CHANNEL_AUTH_LOCAL_MODAL_EVENT'].includes(val)
    })

    this.getChannel("CHANNEL_AUTH_LOCAL", authPayloadFilter)
      .subscribe(this.modal$OnChannelModalEvent.bind(this));

    const uiPayloadFilter = new ChannelPayloadFilter({
      eventType: 'modal'
    })

    this.getChannel("CHANNEL_UI", uiPayloadFilter)
      .subscribe(this.modal$OnChannelModalEvent.bind(this));




  }

  addRegisteredActions() {
    return [
      "CHANNEL_MODAL_OPEN_EVENT",
      "CHANNEL_MODAL_CLOSE_EVENT"
    ];
  }

  onViewStreamInfo() {}
}
