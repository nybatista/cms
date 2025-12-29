import { ViewStream } from "spyne";
import AuthAppListItemTmpl from "./templates/auth-view-profile-list-item.tmpl.html";

export class AuthViewProfileListItem extends ViewStream {
  constructor(props = {}) {
    props.tagName = "li";
    props.class = "auth-view-list-item";
    props.template = AuthAppListItemTmpl;

    super(props);
  }

  addActionListeners() {
    return [];
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
