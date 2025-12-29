import {ViewStream} from 'spyne';
import {CmsDataPanelTabView} from './cms-data-panel-tab-view';

export class CmsDataPanelTabsHolder extends ViewStream {

    constructor(props={}) {
        props.id='cms-data-panels-tab-holder';
        props.currentFocusPanel = -1;

        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
          ['CHANNEL_SPYNE_JSON_CMS_DATA_ADDED_EVENT', 'onCmsDataReturned'],
          ["CHANNEL_CMS_ITEMS_FOCUS_EVENT", "onPanelFocusEvent"],
          ['CHANNEL_SPYNE_JSON_CMS_(DATA_UI|DATA_UI_PANEL)_FOCUS_EVENT', 'onPanelFocusEvent']
        ];
    }

  onPanelFocusEvent(e){
    const {payload} = e;
    const {rootId} = payload;

    if (rootId !== this.props.currentFocusPanel){

      const focusPanel = this.props.el$(`.cms-data-panel-tab.${rootId}`).el;

      this.props.el$('.cms-data-panel-tab').setActiveItem('focus', focusPanel);
    }

    this.props.currentFocusPanel = rootId;


  }

    onCmsDataReturned(e){
      const {payload} = e;

      //console.log("TAB HOLDER ",e);

      const {__cms__rootData} = payload;

      const data = __cms__rootData;

      this.appendView(new CmsDataPanelTabView({data}));

      this.props.el$('.cms-data-panel-tab').setActiveItem('focus', '.cms-data-panel-tab:last-child');


      //this.appendView(new CmsDataPanel({data}), '.data-panels-container');


      //console.log("data on panel holder is ",{fileName, rootProxyId});

    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }

    onRendered() {
      this.addChannel("CHANNEL_SPYNE_JSON_CMS_DATA");
      this.addChannel("CHANNEL_SPYNE_JSON_CMS_DATA_UI");
      this.addChannel("CHANNEL_CMS_ITEMS");


    }

}

