import {ViewStream} from 'spyne';
import {path} from 'ramda';

export class Navbar extends ViewStream {

    constructor(props={}) {
        props.id = 'navbar';
        props.template = require('./templates/navbar.tmpl.html');
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
            ["CHANNEL_ROUTE_(CHANGE|DEEPLINK)_EVENT", 'onRouteChange']
        ];
    }

    onRouteChange(e){
      const {pageId} = path(['payload', 'routeData'], e);

      const selected = `.link-${pageId}`;

      this.props.anchors$.setActiveItem('selected', selected);

      //console.log('change is route ',{pageId, selected, e});

    }

    broadcastEvents() {
        // return nexted array(s)
        return [
            ['a' ,'click']
        ];
    }

    onRendered() {
        this.props.anchors$ = this.props.el$('nav a');
        this.addChannel("CHANNEL_ROUTE");
    }

}

