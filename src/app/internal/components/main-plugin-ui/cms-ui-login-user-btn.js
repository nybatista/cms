import { ViewStream } from 'spyne';
import LoginBtnTmpl from './templates/cms-ui-login-user-btn.tmpl.html'

export class CMS_UI_LoginUserBtn extends ViewStream {
  constructor(props = {}) {
    props.id = 'cms-ui-login-user-btn';
    props.template = LoginBtnTmpl;
    super(props);
  }

  addActionListeners() {
    return [];
  }

  broadcastEvents() {
    return [
      ['cms-ui-login-user-btn', 'click']
    ];
  }

  onRendered() {}
}
