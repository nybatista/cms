import { ViewStream } from "spyne";
import AuthLoginBtnTmpl from "./templates/auth-login-btn.tmpl.html";
export class AuthViewLoginBtn extends ViewStream {
  constructor(props = {}) {
    props.id = "auth-login-btn";
    props.template = AuthLoginBtnTmpl;
    props.channels = [["CHANNEL_AUTH_LOCAL", true]];
    super(props);
  }

  addActionListeners() {
    return [["CHANNEL_AUTH_LOCAL_AUTHENTICATION_EVENT", "disposeViewStream"]];
  }

  broadcastEvents() {
    return [["button", "click"]];
  }

  onRendered() {}
}
