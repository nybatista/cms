import {ViewStream, DomElementTemplate} from 'spyne';
import {BlogView} from './blog-view';
import {IntegrationTestRunner} from './integration-test-runner.js';
export class PageView extends ViewStream {

    constructor(props={}) {
        props.id = `page-${props.data.pageId}`;
        props.class = `app-page ${props.data.pageId} reveal`;
       //console.log("DATA IS ",props.data);
        props.template = require('./templates/page-view.tmpl.html');
        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
            ['CHANNEL_ROUTE_CHANGE_EVENT', 'onChannelRoute']

        ];
    }

    onChannelRoute(e){

      this.disposeViewStream();

    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }


    checkToAddBlogItems(props=this.props){
      const {pageId} = props.data;
      const addBlogItem = (blogData)=>{
       // data['pageId'] = pageId;
        this.appendView(new BlogView({blogData}), '.app-page-subnav-container');
      }
      if (props.data.content){
        props.data.content.forEach(addBlogItem);
      }
    }

    addNestedData(){

      const data = this.props.nestedData;
      //console.log('the data is nested ',data);
      const tmpl = `<h3>nested data is {{merge_config.rule_1.type}} </h3>`

      const html = new DomElementTemplate(tmpl, data);

      this.props.el$('#nested-data-holder').el.appendChild(html.renderDocFrag());

    }



  onRendered() {

      this.addChannel("CHANNEL_ROUTE", true);

      this.checkToAddBlogItems();
      this.addNestedData();
      if (this.props.data.integrationTests !==undefined) {
        const fixture = this.props.data.integrationTests;
        this.appendView(new IntegrationTestRunner({fixture}), '.integration-test-runner-holder');
        console.log('integration tests are ',this.props.data.integrationTests);;
      }
    }

}

