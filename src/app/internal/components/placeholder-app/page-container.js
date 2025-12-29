import {ViewStream} from 'spyne';
import {PageView} from './page-view';

export class PageContainer extends ViewStream {

    constructor(props={}) {
        props.id = 'page-container';
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
          ["CHANNEL_ROUTE_(CHANGE|DEEPLINK)_EVENT", "onChannelRouteChangeEvent"]
        ];
    }


    getPageDataById(pageId){
      const filterByPageId = (o) => o.pageId === pageId;
      return  this.props.data.content.filter(filterByPageId)[0]
    }

    onChannelRouteChangeEvent(e){
      const {payload} = e;
      const {pageId} = payload.routeData;
      const data = this.getPageDataById(pageId);
     // const data = Object.assign({}, dataPage);
     // data['nestedData'] = this.props.nestedData;
      const {nestedData} = this.props;
      this.appendView(new PageView({data, nestedData}));
      //console.log('channel route change event ',{payload}, this.props.data.content);



    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }

    onRendered() {
        this.addChannel("CHANNEL_ROUTE");

    }

}

