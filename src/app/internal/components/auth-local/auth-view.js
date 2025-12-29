import { ViewStream } from "spyne";
import { AuthViewLoginBtn } from "./auth-view-login-btn";
import { AuthViewProfile } from "./auth-view-profile";

export class AuthView extends ViewStream {
  constructor(props = {}) {
    props.id = "auth-view";
    props.channels = ["CHANNEL_AUTH_LOCAL"];
    props.isAuthenticated = -1;

    super(props);
  }

  addActionListeners() {
    return [
      ["CHANNEL_AUTH_LOCAL_CONFIG_LOADED_EVENT", "auth$onAuthenticationEvent"],
    ];
  }

  auth$onAuthenticationEvent(e) {
    const { user } = e.payload;

    const { isAuthenticated } = user;
    //console.log("THIS IS ",{ isAuthenticated, userRecord, userProfile });

    if (isAuthenticated !== this.props.isAuthenticated) {
      this.props.isAuthenticated = isAuthenticated;
      this.props.el$.toggleClass("authenticated", isAuthenticated);

      const viewClass = isAuthenticated ? AuthViewProfile : AuthViewLoginBtn;
      let data = { userProfile: user };

     //console.log("AUTH VIEW ", { data, user, e });
      this.appendView(new viewClass({ data }));
    }

    //console.log("VIEW IS ", isAuthenticated);
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
