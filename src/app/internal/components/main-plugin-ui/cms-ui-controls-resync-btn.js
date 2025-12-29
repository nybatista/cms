import { ViewStream } from 'spyne';
import { toPairs} from "ramda";
import Tmpl from "./templates/cms-ui-controls-resync-btn.tmpl.html";

export class CMS_UI_ControlsResyncBtn extends ViewStream {
  constructor(props = {}) {
    props.id = 'cms-resync-btn';
    props.tagName = 'button';

    props.title = 'click to sync cms';
    props["aria-describedby"]="tip-save"

    props.class = "inline-block px-6 py-2.5 bg-orange-700 font-medium text-xs leading-tight uppercase rounded shadow-lg hover:bg-orange-700 hover:shadow-lg focus:bg-orange-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";



    props.dataset = {};
    props.channels=["CHANNEL_ROUTE"];
    props.dataset['channel'] = "ROUTE";

    const addKeyValData = ()=>{
      const addKV = (a)=>{
        const [k,v] = a;
       //console.log("dataset ",{k,v,a,props})
        props.dataset[k]=v;
      }
      const arr = toPairs(props.data);
      arr.forEach(addKV);
    }

    addKeyValData();

    props.template = Tmpl;

   //console.log("props is ",props, toPairs(props.data))
    super(props);
  }

  addActionListeners() {
    return [
      ['CHANNEL_ROUTE_CHANGE_EVENT', "animateOut"]
    ];
  }

  broadcastEvents() {
    return [
      ['button', 'click']
    ];
  }

  fadeIn(bool=true){
    this.props.el$.toggleClass('active', bool);
  }

  animateOut(){
    this.fadeIn(false);
    const onRemove = ()=>this.disposeViewStream();
    window.setTimeout(onRemove, 350);

  }


  animateIn(){
    const delayAnim=()=>this.fadeIn();
    window.setTimeout(delayAnim, 500);

  }

  onRendered() {
    this.animateIn();

  }
}
