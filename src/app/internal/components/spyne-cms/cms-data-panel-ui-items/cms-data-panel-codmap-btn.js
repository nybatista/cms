import {ViewStream} from 'spyne';

export class CmsDataPanelCodeMapBtn extends ViewStream {

    constructor(props={}) {
        props.id='cms-data-codemap-btn-holder';
        props.template = require('../templates/cms-data-panel-code-map-btn.tmpl.html');
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
          ["CHANNEL_SPYNE_JSON_CMS_DATA_UI_DATA_STATE_CHANGED_EVENT", "onDataStateChanged"]

        ];
    }

    broadcastEvents() {
        // return nexted array(s)
        return [
            ['button', 'click']
        ];
    }

    onDataStateChanged(e){
      const {payload} = e;
      const {dataStateChanged, dataHasUpdated} = payload;

      const dataHasNotUpdated = dataHasUpdated === false;

     // console.log('data change ',{dataHasNotUpdated,dataHasUpdated, dataStateChanged, payload})

      this.props.el$('button').toggleClass('disabled', dataHasNotUpdated);


    }

    onRendered() {

      this.addChannel("CHANNEL_SPYNE_JSON_CMS_DATA_UI");

    }

}

