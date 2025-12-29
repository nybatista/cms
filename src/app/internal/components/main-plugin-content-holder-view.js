import {ViewStream, DomElement} from 'spyne';
import {SpynePluginCmsDragHandleTraits} from '../traits/spyne-plugin-json-cms-ui-drag-handle-traits';
import {CmsUI} from './main-plugin-ui/cms-ui';
import {CmsDataPanelHolder} from './spyne-cms/cms-data-panel-holder';
import {CmsDataPanelUI} from './spyne-cms/cms-data-panel-ui-items/cms-data-panel-ui';
import {SpynePluginJsonCmsUIResizeTraits} from '../traits/spyne-plugin-json-cms-ui-resize-traits';
import { AuthModalHolder} from "./auth-local/auth-modal-holder";

export class MainPluginContentHolderView extends ViewStream {

  constructor(props = {}) {
    props.id = 'spyne-plugin-json-cms-content-holder';
    props.traits = [SpynePluginCmsDragHandleTraits, SpynePluginJsonCmsUIResizeTraits];
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CHANGE_COLOR_THEME_EVENT', 'onChangeColorTheme'],
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_RESIZE_EVENT', 'onResizeEvent'],
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_MIN_MAX_CLOSE_EVENT', 'onMinMaxCloseEvent'],
      ['CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CORNER_PIN_EVENT', 'onCornerPinEvent']
    ];
  }

  onChangeColorTheme(e){
    const {isDarkMode} = e.payload;
    //console.log('on change color theme ',{isDarkMode, e});
  }

  onMinMaxCloseEvent(e) {
    const {pluginJsonCmsWidth, pluginJsonCmsHeight, isCmsMode} = e.payload;

    if (isCmsMode === true){
      const horzPosition = "right";
      const vertPosition = "bottom";
      const cornerClassesArr = [horzPosition, vertPosition];
      this.resize$AddCornerPinClasses(cornerClassesArr);
    }

    this.resizePanel(pluginJsonCmsWidth, pluginJsonCmsHeight);
  }

  onInitPanel() {
    const {minimize, maximize} = this.props.config;
    let selectorBtn = minimize === true ? 'close' : 'min-max';
    selectorBtn = maximize === true ?  'expand' : selectorBtn;
    const checkToResizePanel = ()=> {
      //const closeBtnQuery = `.ui-option.${selectorBtn}.cms-btn`;
      const closeBtnQuery = `.ui-option.expand.cms-btn`;
      const closeBtn = document.querySelector(closeBtnQuery);
      //console.log('close btn is ',{closeBtnQuery,closeBtn})
      if (closeBtn !== null){
        const {pluginJsonCmsWidth, pluginJsonCmsHeight} = closeBtn.dataset;
        this.resizePanel(pluginJsonCmsWidth, pluginJsonCmsHeight);
      } else {
        //window.setTimeout(checkToResizePanel, 1000);
      }


    }

    checkToResizePanel();

    if (minimize === true){
     const onMinimize = ()=> this.resizePanel("336px", "40px");
     requestAnimationFrame(onMinimize)
    }

  }

  resizePanel(w, h) {
    const windowWidth = window.innerWidth - 32;
    const windowHeight = window.innerHeight - 32;


    const width = Math.min(parseInt(w), windowWidth);
    const height = Math.min(parseInt(h), windowHeight);
    //console.log('width adjust ',{w,h, windowWidth,windowHeight, width, height})

    this.props.el.style['width'] = w;//`${width}px`;
    this.props.el.style['height'] = h;
  }

  onCornerPinEvent(e) {
    const {horzPosition, vertPosition} = e.payload;
    const cornerClassesArr = [horzPosition, vertPosition];
    this.resize$AddCornerPinClasses(cornerClassesArr);
  }

  onResizeEvent(e) {
    this.dragHandle$ResizeCms(e.payload);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    const {config, pluginName} = this.props;
/*
    const headerEl = new DomElement({
      tagName: 'header',
      template: `<h5>SPYNE CMS</h5><span class="material-icons">
settings_backup_restore
</span>`
    });
*/

    this.appendView(new CmsUI({config, pluginName}),
    );



    this.appendView(new CmsDataPanelHolder());
    this.appendView(new CmsDataPanelUI());

    this.appendView(new AuthModalHolder());
    //this.props.el.appendChild(headerEl.render());
    //this.appendView(new CmsMenuView({config}));
    //this.appendView(new CmsCodeView());
    this.addChannel('CHANNEL_PLUGIN_JSON_CMS_PLUGIN');
    this.onInitPanel();
  }

}
