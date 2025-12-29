import {ViewStream, SpyneApp} from 'spyne';
import {UtilTraits} from '../../traits/util-traits';
import {head,tail,isEmpty} from 'ramda';

export class BlogView extends ViewStream {

    constructor(props={}) {
        props.tagName='li';
        props.class='blog-item';
        props.data = props.blogData;

        //console.log('blog data is ',props.data);
      /*  props.data.img = props.blogData.img;
        props.data.linkDataset = props.blogData.dataset;
        props.data.introText = head(props.blogData.article);
        props.data.articleText = tail(props.blogData.article);*/
        props.traits = [UtilTraits];



        props.template = require('./templates/blog-view.tmpl.html');
        super(props);

    }

    addActionListeners() {
        // return nexted array(s)
        return [

          ["CHANNEL_ROUTE_(CHANGE|DEEPLINK)_EVENT", 'onCardChangeEvent']

          /*  ['CHANNEL_APP_ROUTE_PAGE_CHANGE_EVENT',     'onRouteChangeEvent'],
            ['CHANNEL_APP_ROUTE_CARD_CHANGE_EVENT',    'onCardChangeEvent'],
            ['CHANNEL_APP_ROUTE_CARD_CROSSFADE_EVENT', 'onCardChangeEvent'],
  */
        ]
    }


  onRouteChange(e){
      const {routeData, isDeepLink} = e.payload;
      const expandView = this.util$checkForDeeplink(routeData, isDeepLink);
      this.props.el$.toggleClass('expanded', expandView);

      //console.log("ROUTE CHANGE IS ",{routeData, isDeepLink, expandView})
      if (expandView){
        const scrollToView = ()=> {
          const top = this.util$GetOffsetTop()
          window.scrollTo(0, top);
        }
        this.setTimeout(scrollToView, 250);
      }

  }

    onRouteChangeEvent(e){
      const {routeData, isDeepLink} = e.payload;
      const expandView = this.util$checkForDeeplink(routeData, isDeepLink);
      this.props.el$.toggleClass('expanded', expandView);
      if (expandView){
        const scrollToView = ()=> {
          const top = this.util$GetOffsetTop()
          window.scrollTo(0, top);
        }
        this.setTimeout(scrollToView, 250);
      }
    }

    onCardChangeEvent(e){
      const {payload, srcElement} = e;
      const {routeData} = payload;
      const {cardId} = routeData;
      const isLocalEvent = this.isLocalEvent(e);
      const cardIdCurrent = this.props.data.cardId;

      const tempScrollLock = ()=>{

        const returnScrolling = ()=> {
          SpyneApp.pluginsFn.disableScrollLock();
          const top = this.util$GetOffsetTop();
          window.scrollTo(0, top);
        }

        SpyneApp.pluginsFn.enableScrollLock(undefined, true);
        requestAnimationFrame(returnScrolling)
      }


      const resetTop = ()=>{
        const top = this.util$GetOffsetTop();
        window.scrollTo(0, top);
      }

      const minimize = ()=>this.props.el$.removeClass('expanded');
      const resetTime = isEmpty(srcElement) ? 0 : 200;

      //console.log("CARD CHANGE ",cardId, cardIdCurrent, routeData, payload)

      if(cardIdCurrent === cardId){
        this.props.el$.addClass('expanded');
        const top = this.util$GetOffsetTop();
        const behavior = isLocalEvent ? 'smooth' : 'auto';
        window.scrollTo({
          top,
          behavior
        });

        if (isLocalEvent) {
         // this.setTimeout(tempScrollLock, resetTime);
        } else {
          requestAnimationFrame(resetTop)
        }

      } else {
          this.setTimeout(minimize, resetTime);
      }

    }

    broadcastEvents() {
        // return nexted array(s)
        return [
          ['a.expand-card', 'click']
        ]
    }

    onRendered() {
      this.addChannel("CHANNEL_ROUTE");
    }


}

