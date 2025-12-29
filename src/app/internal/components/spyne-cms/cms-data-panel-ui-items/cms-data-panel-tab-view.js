import {ViewStream} from 'spyne';
import {SpyneCmsPanelTraits} from '../../../traits/spyne-cms-panel-traits';

export class CmsDataPanelTabView extends ViewStream {

    constructor(props={}) {
        props.traits = SpyneCmsPanelTraits;

        //console.log("CMS DATA TAB ",props);
       const {fileName, rootProxyId} = props.data;
       props.class=`cms-data-panel-tab ${rootProxyId}`;
       props.dataset = {};
      props['dataset']['rootId'] = rootProxyId;
      props['dataset']['type'] = 'cms-data-panel-active-ui';
      props['dataset']['uiType'] = 'cms-data-panel-tab';

      props.data.fileNameClean = SpyneCmsPanelTraits.spyneCmsPanel$FileNameOnly(fileName);

       props.template = require('./templates/cms-data-panel-tab.tmpl.html');

       //console.log("FILE NAME IS ",{fileName, rootProxyId})



      super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [];
    }

    broadcastEvents() {
        // return nexted array(s)
        return [
            ['.cms-data-panel-tab', 'click']
        ];
    }

    onRendered() {

    }

}

