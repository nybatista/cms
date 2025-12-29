import {ViewStream} from 'spyne';
import {CmsDataPanelTabsHolder} from './cms-data-panel-ui-items/cms-data-panel-tabs-holder';
import {CmsDataPanel} from './cms-data-panel';

export class CmsDataPanelHolder extends ViewStream {

    constructor(props={}) {
        props.id = 'cms-data-panel-holder';
        props.template = require('./templates/cms-data-panel-holder.tmpl.html');
        props.currentFocusPanel = -1;
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)

      //actionsArr.push(["CHANNEL_CMS_ITEMS_FOCUS_EVENT", "onCmsFocusEvent", focusPayloadFilter]);


      return [
          ['CHANNEL_SPYNE_JSON_CMS_DATA_ADDED_EVENT', 'onCmsDataReturned'],
          ["CHANNEL_CMS_ITEMS_FOCUS_EVENT", "onPanelFocusEvent"],
          ['CHANNEL_SPYNE_JSON_CMS_(DATA_UI|DATA_UI_PANEL)_FOCUS_EVENT', 'onPanelFocusEvent']

        ];
    }

    onPanelFocusEvent(e){
      const {payload} = e;
      const {rootId} = payload;

      if (rootId !== this.props.currentFocusPanel &&  this.props.el$('.cms-data-panel').exists===true){

        const focusPanel = this.props.el$(`.cms-data-panel.${rootId}`).el;

       this.props.el$('.cms-data-panel').setActiveItem('focus', focusPanel);
      }

      this.props.currentFocusPanel = rootId;


    }

    onCmsDataReturned(e){
        const {payload} = e;

        const data = payload;

        this.appendView(new CmsDataPanel({data}), '.data-panels-container');

        //console.log("data on panel holder is ",payload.__cms__rootData);

    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }

    onRendered() {
      this.appendView(new CmsDataPanelTabsHolder(), '#cms-data-panel-tabs-container');
      this.addChannel("CHANNEL_SPYNE_JSON_CMS_DATA")
      this.addChannel("CHANNEL_SPYNE_JSON_CMS_DATA_UI")
      this.addChannel("CHANNEL_CMS_ITEMS");

    }

}

