import { Channel, ChannelPayloadFilter } from 'spyne';
import { TinymceTraits} from "../traits/tinymce-traits";
import { TinymceChannelTraits} from "../traits/tinymce-channel-traits";

export class ChannelTinymce extends Channel {
  constructor(name, props = {}) {
    name = 'CHANNEL_TINYMCE';
    props.traits = [TinymceChannelTraits]
    props.sendCachedPayload = false;
    super(name, props);
  }

  onRegistered() {

    const typeFilter = new ChannelPayloadFilter({
      panelEventType: "tinymce"
    })

    this.getChannel("CHANNEL_UI", typeFilter)
      .subscribe(this.tinymceChannel$OnDataPanelEvent.bind(this));

  }



  addRegisteredActions() {
    return [
      "CHANNEL_TINYMCE_EDIT_RICH_TEXT_EVENT",
      "CHANNEL_TINYMCE_CLOSE_TINYMCE_EVENT"

    ];
  }

  onViewStreamInfo() {}
}
