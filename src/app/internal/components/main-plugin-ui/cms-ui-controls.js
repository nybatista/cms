import {ViewStream} from 'spyne';
import {CmsUIMaxMinClose} from './cms-ui-max-min-close';
import {CMS_UI_ColorThemeBtn} from './cms-ui-color-theme-btn';
import {CMS_UI_LoginUserBtn} from "./cms-ui-login-user-btn";
import {CMS_UI_ControlsResyncBtn} from "./cms-ui-controls-resync-btn";
import { AuthView } from "../auth-local/auth-view";

//import 'material-symbols'
export class CMS_UI_Controls extends ViewStream {

  constructor(props = {}) {
    props.id = 'cms-ui-controls';
    props.template = require('./templates/cms-ui-controls.tmpl.html');
    props.channels = ["CHANNEL_AUTH_LOCAL"];
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
    ];
  }


  broadcastEvents() {
    // return nexted array(s)
    return [
      ['.cms-btn', 'click']
    ];
  }

  onRendered() {

    // HIDING COLOR THEME CHANGE BUTTON FOR NOW
    // this.appendView(new CMS_UI_ColorThemeBtn(), '.content-end');
    //

    this.appendView(new CmsUIMaxMinClose(), '.content-end');
    //this.appendView(new CMS_UI_LoginUserBtn, '.content-end');
    this.appendView(new AuthView, '.content-end');

  }

}
