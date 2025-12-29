import {ViewStream} from 'spyne';
import {CmsUIMaxMinClose} from './cms-ui-max-min-close';
import {CmsUIDragHandlesContainer} from './cms-ui-drag-handles-container';
import {CmsUICornersContainer} from './cms-ui-corners-container';
import {CMS_UI_Controls} from './cms-ui-controls';

export class CmsUI extends ViewStream {

  constructor(props = {}) {
    props.id = 'cms-ui';
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
    this.appendView(new CMS_UI_Controls());
    this.appendView(new CmsUIDragHandlesContainer());
    this.appendView(new CmsUICornersContainer());
  }

}
