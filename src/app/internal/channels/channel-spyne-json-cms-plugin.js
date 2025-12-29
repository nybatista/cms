import {Channel, ChannelPayloadFilter} from 'spyne';
import {SpynePluginCmsUITraits} from '../traits/spyne-plugin-json-cms-ui-traits';
import {propEq} from 'ramda';

export class ChannelSpyneJSONCmsPlugin extends Channel {

  constructor(name, props = {}) {
    name = SpynePluginCmsUITraits.spyneCms$GetMainChannelName();
    props.traits = [SpynePluginCmsUITraits];
    props.sendCachedPayload = true;
    super(name, props);
  }

  onRegistered() {
    //console.log("CMS HOST AND SERVER ON REG ",CMS_HOST_SERVER, CMS_HOST_PORT)

    const onConfigReturned = (e) => {
      this.props.config = e.payload;
    //  this.initializeAllChannelListeners();
      this.addCmsBtnsListener();
      this.sendInitAction();
    };

    const config$ = this.getChannel('CHANNEL_PLUGIN_CMS_CONFIG');
    config$.subscribe(onConfigReturned);
  }

  addCmsBtnsListener() {
    const grabberFilter = new ChannelPayloadFilter({
      selector: '.cms-btn',
      isCmsItem: "true"

    });
    this.getChannel('CHANNEL_UI', grabberFilter).
        subscribe(this.onCmsBtnEvent.bind(this));

  }

  onCmsBtnEvent(e) {

    //console.log("CMS BTN EVENT ",e);
    const {pluginJsonCmsBtnType} = e.payload;
    const methodHash = {
      grabber: this.onWindowShadeEvent.bind(this),
      cmsMenu: this.onCmsMenuBtnEvent.bind(this),
      expandTruncatedData: this.onExpandTruncatedData.bind(this),
      minMaxClose: this.onMinMaxBtnEvent.bind(this),
      cornerPin: this.onCornerPinEvent.bind(this),
      colorThemeChange: this.onColorThemeChange.bind(this)
    };


    const fn = methodHash[pluginJsonCmsBtnType];
    return fn(e);
  }

  onColorThemeChange(e){
    const {isDarkMode} = e.srcElement.el.dataset;
    const isSetToDarkMode = isDarkMode === true || isDarkMode === "true";
    const newPayload = {isDarkMode: !isSetToDarkMode};
    const action = "CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CHANGE_COLOR_THEME_EVENT";
     //console.log(" color change event has occurred ",{isSetToDarkMode, isDarkMode,newPayload, e});

    this.sendChannelPayload(action, newPayload);
  }

  onCornerPinEvent(e) {
    const {horzPosition, vertPosition} = e.payload;
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CORNER_PIN_EVENT';

    this.sendChannelPayload(action, {horzPosition, vertPosition});
  }

  onExpandTruncatedData(e) {

    const {cachedChannelName} = e.payload;
    const {cmsChannelName} = this.props.channelsMaintainer;

    const payload = this.props.channelsMaintainer.getChannelDataByChannelName(
        cachedChannelName);
    const {srcJsonPayload, cachedChannel} = payload;
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_EXPAND_CACHED_DATA_EVENT';
    const cmsChannelData = srcJsonPayload;
    if (srcJsonPayload !== undefined) {
      this.sendChannelPayload(action, {
        cmsChannelData,
        cachedChannel,
        cmsChannelName,
        cachedChannelName,
      });
    }

  }

  onCmsMenuBtnEvent(e) {
    const {cmsIsFocused, channelName} = e.payload;
    const b = {
      'true': true,
      'false': false,
    };

    const cmsIsFocusedBool = b[cmsIsFocused];
    this.props.channelsMaintainer.setMaintainerState(cmsIsFocusedBool,
        channelName);
    const {focusIsAll} = this.props.channelsMaintainer;
    const action = focusIsAll
        ? 'CHANNEL_PLUGIN_JSON_CMS_CHANNEL_STATE_CHANGE_EVENT'
        : 'CHANNEL_PLUGIN_JSON_CMS_CHANNEL_DATA_EVENT';
    this.sendCmsEvent(action);

  }

  sendCmsEvent(action = 'CHANNEL_PLUGIN_JSON_CMS_CHANNEL_DATA_EVENT') {
    const {
      cmsChannelName,
      sendCmsEvent,
      cmsIsFocused,
      cmsChannelData,
      cmsStateChanged,
      focusIsAll,
      focusChanged,
      cmsChannelState,
    } = this.props.channelsMaintainer;

    this.sendChannelPayload(action, {
      cmsChannelName,
      focusIsAll,
      focusChanged,
      sendCmsEvent,
      cmsIsFocused,
      cmsChannelData,
      cmsStateChanged,
      cmsChannelState,
    });

  }

  onWindowShadeEvent(e) {
    const toggleCmsOpen = !this.props.toggleCmsOpen;
    this.props.toggleCmsOpen = toggleCmsOpen;
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_WINDOWSHADE_EVENT';
    this.sendChannelPayload(action, {toggleCmsOpen});

  }

  onChannelEvent(e) {
    const {action, payload, channelName, srcElement, event} = e;
    const isCmsItem = channelName === 'CHANNEL_UI' &&
        propEq('true', 'isCmsItem')(payload);
    if (isCmsItem) {
      return;
    }

    this.props.channelsMaintainer.updateMaintainers(channelName,
        {action, payload, srcElement, event});
    const {sendCmsEvent} = this.props.channelsMaintainer;
    if (sendCmsEvent === true) {
      this.sendCmsEvent();
    }
  }

/*  initializeAllChannelListeners() {
    const addToAllListener = (channelName) => {
      this.getChannel(channelName).subscribe(this.onChannelEvent.bind(this));
    };

    this.props.allChannelsArr = this.props.config.allChannelsArr;
    this.props.channelsMaintainer = CmsChannelPayloadsTraits.cPayload$CreatePayloadMaintainerArr(
        this.props.allChannelsArr);
    this.props.allChannelsArr.forEach(addToAllListener);

  }*/

  sendInitAction() {
    const {openOnLoad} = this.props.config;
    const toggleCmsOpen = openOnLoad;
    this.props.toggleCmsOpen = toggleCmsOpen;
  }

  onCacheChannelData(e) {
    const {cachedChannel, cachedData} = e.payload;
    this.props.channelsMaintainer.cacheChannelData(cachedChannel, cachedData);
  }

  onMinMaxBtnEvent(e) {
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_MIN_MAX_CLOSE_EVENT';
    const {
      pluginJsonCmsResizeType,
      pluginJsonCmsWidth,
      pluginJsonCmsHeight,
    } = e.payload;

    const isCmsMode = pluginJsonCmsResizeType === 'max';

    this.sendChannelPayload(action,
        {pluginJsonCmsResizeType, pluginJsonCmsWidth, isCmsMode, pluginJsonCmsHeight});
  }

  onDragHandleEvent(e) {

    //console.log("DRAG HANDLE EVENT ",e);
    const {payload} = e;
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_RESIZE_EVENT';
    this.sendChannelPayload(action, payload);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_INIT',
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_EXPAND_CACHED_DATA_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CHANGE_COLOR_THEME_EVENT',
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_DRAG_HANDLE_EVENT', 'onDragHandleEvent'],
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_RESIZE_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_MIN_MAX_CLOSE_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_CHANNEL_DATA_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_CHANNEL_STATE_CHANGE_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_WINDOWSHADE_EVENT',
      'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CORNER_PIN_EVENT',
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CACHE_CHANNEL_DATA', 'onCacheChannelData'],
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
    const action = 'CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CHANGE_COLOR';
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}
