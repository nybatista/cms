import {ViewStream} from 'spyne';

export class UIFooterView extends ViewStream {

  constructor(props = {}) {
    props.id='app-footer';
    props.sendLifecyleEvents = true;
    props.template = require('./templates/ui-footer.tmpl.html')
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.props.el$.toggleClass('card-mode', this.props.cardMode);
  }

}
