import {ViewStream} from 'spyne';

export class CmsUIMaxMinClose extends ViewStream {

  constructor(props = {}) {
    props.id='cms-max-min-close';
    props.template = require('./templates/cms-max-min-close.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }


  broadcastEvents() {
    // return nexted array(s)
    return [
    ];
  }

  onRendered() {
      this.addChannel("CHANNEL_PLUGIN_JSON_CMS_PLUGIN");
  }

}
