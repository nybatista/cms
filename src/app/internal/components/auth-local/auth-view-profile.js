import { ViewStream } from "spyne";
import { AuthLocalTraits } from "../../traits/auth-local-traits";
import UserProfileTmpl from "./templates/auth-view-profile.tmpl.html";
import { AuthViewProfileAppsList } from "./auth-view-profile-apps-list";

export class AuthViewProfile extends ViewStream {
  constructor(props = {}) {
    props.class = "auth-user-profile";
    props.traits = [AuthLocalTraits];
   //console.log('profile data ',props);
    props.data = props.data.userProfile;
    props.template = UserProfileTmpl;
    props.channels = ["CHANNEL_AUTH_LOCAL"];
    super(props);
  }

  addActionListeners() {
    return [["CHANNEL_AUTH_LOCAL_TOGGLE_PROFILE_EVENT", "onToggleProfile"]];
  }

  onToggleProfile(e) {
    const { toggleState } = e.payload;
    this.props.el$.toggleClass("active", toggleState);
  }

  broadcastEvents() {
    return [["button", "click"]];
  }

  onRendered() {
    if (this.props.data.userRecord !== undefined) {
      this.appendView(
        new AuthViewProfileAppsList({ data: this.props.data.userRecord }),
        ".auth-view-apps-list-container",
      );
    }
  }
}
