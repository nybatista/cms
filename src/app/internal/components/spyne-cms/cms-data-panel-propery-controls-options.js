import {ViewStream} from 'spyne';
import {SpyneCmsPanelDataPropertyControlsTraits} from '../../traits/spyne-cms-panel-data-property-controls-traits';

export class CmsDataPanelProperyControlsOptions extends ViewStream {

    constructor(props={}) {
        props.class = "control-options-panel";
        props.traits = SpyneCmsPanelDataPropertyControlsTraits;
        props.data.propsArr = SpyneCmsPanelDataPropertyControlsTraits.cmsPropControls$CreateOptionArray(props.data, props.isContainer);

        //console.log('props data ',props.data);

        props.template = require('./templates/cms-data-panel-property-controls-options.tmpl.html');

        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
            ["CHANNEL_DATA_PANELS_CONTROL_UI_EVENT", "onCloseOptions"]
        ];
    }

  onCloseOptions(e){

     // this.props.el.parentElement.classList.remove('expand');


      this.disposeViewStream();
    }

    broadcastEvents() {
        // return nexted array(s)
        return [
          ['button.cms-data-panel-btn', 'click']
        ];
    }

    onRendered() {

      if (this.props.isContainer !== true) {
        this.props.el$(`button.type-${this.props.data.valueType}`).addClass('disabled');

      }
      //console.log("ADD CLASS ",this.props.isContainer, this.props.el$(`button.type-${this.props.data.valueType}`).el);


      this.addChannel("CHANNEL_DATA_PANELS", true);
    }

}

