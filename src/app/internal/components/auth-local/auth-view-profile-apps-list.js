import { ViewStream } from "spyne";
import { AuthViewProfileListItem } from "./auth-view-profile-list-item";
import { AuthLocalTraits } from "../../traits/auth-local-traits";

export class AuthViewProfileAppsList extends ViewStream {
  constructor(props = {}) {
    props.tagName = "ul";
    props.traits = [AuthLocalTraits];
    props.id = "auth-view-apps-list";

    super(props);
  }

  addActionListeners() {
    return [];
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {
    this.authView$AddListItems();
  }
}
