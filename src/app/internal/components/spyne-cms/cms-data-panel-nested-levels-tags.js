import {ChannelPayloadFilter, ViewStream} from 'spyne';

export class CmsDataPanelNestedLevelsTags extends ViewStream {

    constructor(props={}) {
        props.id="nested-levels-tags-holder";

        //props.data =  [1,2,3,4,5].map(n=>String(n));
        props.template = require('./templates/cms-data-panel-nested-levels-tags.tmpl.html');
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)

      const {rootProxyId} = this.props.data;


      const onDataPanelEventFilter = new ChannelPayloadFilter({
        payload: (v)=>v.rootProxyId === rootProxyId
      });

        return [
          ["CHANNEL_DATA_PANELS_NEST_LEVEL_UPDATE", "onNestedToggleUpdate", onDataPanelEventFilter],
        ];
    }

    onNestedToggleUpdate(e){
      const {payload} = e;
      const {nestLevel} = payload;
      const tagBtnSel = `.tag-btn-${nestLevel}`;
      this.props.el$('button').setActiveItem('selected', tagBtnSel);
    }

    broadcastEvents() {
        // return nexted array(s)
        return [
            ["button", "click"]
        ];
    }

    onRendered() {
      this.addChannel("CHANNEL_DATA_PANELS")
    }

}

