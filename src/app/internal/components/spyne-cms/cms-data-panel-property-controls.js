import {ViewStream} from 'spyne';
import {SpyneCmsPanelDataPropertyControlsTraits} from '../../traits/spyne-cms-panel-data-property-controls-traits';

export class CmsDataPanelPropertyControls extends ViewStream {

    constructor(props={}) {
        props.class = props.isContainer === true ? 'cms-data-panel-property-controls' : 'cms-data-panel-property-controls container-cms';

        props.traits = [SpyneCmsPanelDataPropertyControlsTraits];
        props.template = props.isContainer === true ? require("./templates/cms-data-panel-property-container-controls.tmpl.html") : require("./templates/cms-data-panel-property-controls.tmpl.html");
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [];
    }

    broadcastEvents() {
        // return nexted array(s)
        return [
            ['.cms-data-panel-btn', 'click']
        ];
    }

    onRendered() {
      this.props.panel$ = this.props.el$('.control-options-panel');
      this.props.controlRight$ = this.props.el$(".ctrls.controls-right");



      if (this.props.data.cmsKey==='randomProp1') {
        this.props.controlRight$.addClass('expand');

      }


    }

}

