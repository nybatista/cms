import {Subject} from 'rxjs';
import {Channel, ChannelPayloadFilter} from 'spyne';
import {SpyneCmsPanelDataTraits} from '../traits/spyne-cms-panel-data-traits';
import {CmsSelectItemBoxTraits} from '../traits/cms-select-item-box.traits';
import {path,includes,defaultTo, pathEq, compose} from 'ramda';

export class ChannelCmsItems extends Channel{

  constructor(name, props={}) {
    name="CHANNEL_CMS_ITEMS";
    props.sendCachedPayload = false;
    props.activeStateChecker = CmsSelectItemBoxTraits.cmsSelectItem$createActiveStateChecker();
    props.activeState = props.activeStateChecker();
    props.activeElement = null;

    super(name, props);
  }

  onRegistered(){

    const mouseOverFilter = new ChannelPayloadFilter({
      action: "CHANNEL_WINDOW_MOUSEOVER_EVENT"

    })

 /*   this.getChannel("CHANNEL_WINDOW", mouseOverFilter)
        .subscribe(this.onCmsItemHover.bind(this));*/

    this.getChannel("CHANNEL_WINDOW")
        .subscribe(this.onWindowEvent.bind(this));

    const inputChangedFilter = new ChannelPayloadFilter({
      action: "CHANNEL_SPYNE_JSON_CMS_DATA_UI_INPUT_CHANGED_EVENT"
    })


    this.getChannel("CHANNEL_SPYNE_JSON_CMS_DATA_UI", inputChangedFilter)
        .subscribe(this.onCmsInputItemChangedEvent.bind(this));

  }



  sendItemFocusedEvent(payload, srcElement={}){
    const action = "CHANNEL_CMS_ITEMS_FOCUS_EVENT";
    this.sendChannelPayload(action, payload, srcElement);

  }
  sendItemBlurEvent(){
    const action = "CHANNEL_CMS_ITEMS_BLUR_EVENT";
    this.sendChannelPayload(action, {action});
  }

  onCmsInputItemChangedEvent(e){
    const {cmsKey, cmsId, isKey, textVal} = e.payload;
    if (this.props.activeState.activeElement === undefined){
      return;
    }

    const {activeElement} = this.props.activeState;

    this.props.activeState = this.props.activeStateChecker({cmsId, cmsKey, activeElement})
    const rootId   = this.getRootId(cmsId);



    const spyneCmsItem = activeElement.closest('spyne-cms-item');
    const spyneCmsItemText = spyneCmsItem.querySelector('spyne-cms-item-text');


    const {isActiveBool, activeElementUpdatedBool} = this.props.activeState;
    const rectBox = spyneCmsItemText.getBoundingClientRect();

    const textUpdated = true;

    const newPayload = {rootId, cmsId, cmsKey, rectBox, isActiveBool,textUpdated, textVal, activeElementUpdatedBool};


    if (String(isKey)!=="true") {
      this.sendItemFocusedEvent(newPayload, activeElement);
    }

  }

  onCheckForBlurEvent(){
    if (this.props.activeState.activeElement !==null){

      this.sendItemBlurEvent();
      this.props.activeState = this.props.activeStateChecker();

    }


  }

  onCheckForFocusEvent(e){
    this.onCmsItemHover(e);
  }

  onWindowEvent(e){
    const {action, payload} = e;

    const blurActionsArr = [
        "CHANNEL_WINDOW_SCROLL_EVENT",
        "CHANNEL_WINDOW_RESIZE_EVENT"
    ]
    const activeActionsArr = ["CHANNEL_WINDOW_MOUSEOVER_EVENT"]


    const defaultFn = ()=>{};

    const blurFn = this.onCheckForBlurEvent.bind(this);
    const focusFn = this.onCheckForFocusEvent.bind(this);

    const fn = blurActionsArr.includes(action) ? blurFn : activeActionsArr.includes(action) ? focusFn : defaultFn;

    fn(e);

   // console.log('window action is ',{action, payload})


  }


  getRootId(str){
    return str.replace(/^(cms-\d{8}-)(.*)$/g, "$1")

  }

  onCmsItemHover(e){
    const {payload} = e;

   // const isCmsItem = payload.relatedTarget.classList !== undefined && payload.relatedTarget.classList.value === 'cms-select-item-hitbox';

    const isCmsItem = pathEq(['relatedTarget', 'classList', 'value'], 'cms-select-item-hitbox')(payload);


    const isCmsRect = compose(  includes('cms-item-rect'), defaultTo([]), path(['relatedTarget', 'classList']))(payload);


    if (isCmsRect === true) {
      const spyneCmsItem = payload.relatedTarget.closest('spyne-cms-item');
      const spyneCmsItemText = spyneCmsItem.querySelector('spyne-cms-item-text');
      const {dataset} = spyneCmsItem;// path(['parentElement', 'parentElement', 'parentElement'])(payload.relatedTarget);
      const {cmsId, cmsKey} = dataset;

      const isValidFocusEvent = SpyneCmsPanelDataTraits.spyneCmsPanelData$HasCmsValues(cmsId, cmsKey);

      const isVisible = CmsSelectItemBoxTraits.cmsSelectItem$IsAvailable(spyneCmsItem);

      //console.log("IS VISIBLE ", isVisible);

      if (isValidFocusEvent === true){
        //const rootId = cmsId.replace(/^(cms-\d{8}-)(.*)$/g, "$1")
        const rootId   = this.getRootId(cmsId);
        const activeElement = payload.relatedTarget;
        const rectBox = spyneCmsItemText.getBoundingClientRect();
        //console.log(' hover payload is  ', {payload});
        this.props.activeState = this.props.activeStateChecker({cmsId, cmsKey, activeElement})
        const {isActiveBool, activeElementUpdatedBool} = this.props.activeState;

        const newPayload = {rootId, cmsId, cmsKey, rectBox, isActiveBool, activeElementUpdatedBool};


        this.sendItemFocusedEvent(newPayload, payload.relatedTarget);


      }


    }
  }

  addRegisteredActions() {

    return [
      "CHANNEL_CMS_ITEMS_FOCUS_EVENT",
      "CHANNEL_CMS_ITEMS_BLUR_EVENT"
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

}

