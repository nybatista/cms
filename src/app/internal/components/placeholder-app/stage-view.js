import {ViewStream} from 'spyne';
import {Navbar} from './navbar';
import {PageContainer} from './page-container';
import {UIFooterView} from './ui-footer-view';

export class StageView extends ViewStream {

    constructor(props={}) {
        props.id = 'stage-view';
        props.tagName = 'main';
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
/*
            ["CHANNEL_FETCH_PLACEHOLDER_APP_DATA_.*_EVENT", 'onDataEvent'],
*/
          ["CHANNEL_PLACEHOLDER_COMBINED_DATA_LOADED_EVENT", "onCombinedDataEvent"]
        ];
    }


  onCombinedDataEvent(e){
   //console.log('combine data loaded ',e);
    const {payload} = e;
    this.props.data = payload;
    const data = this.props.data.placeholderData;
    const nestedData = this.props.data.nestedData;
    this.appendView(new Navbar({data}));
    this.appendView(new PageContainer({data, nestedData}));
    this.appendView(new UIFooterView({data}))


  }



  onDataEvent(e){
      const {payload} = e;
      const data = this.props.data = payload;
      this.appendView(new Navbar({data}));
      this.appendView(new PageContainer({data}));
      this.appendView(new UIFooterView({data}))
      //console.log('data event is ',payload);
    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }

    onRendered() {

      this.addChannel("CHANNEL_FETCH_PLACEHOLDER_APP_DATA");
      this.addChannel("CHANNEL_PLACEHOLDER_COMBINED_DATA");


    }

}

