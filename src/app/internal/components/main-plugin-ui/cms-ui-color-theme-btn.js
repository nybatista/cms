import {ViewStream} from 'spyne';

//import 'material-symbols'
export class CMS_UI_ColorThemeBtn extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'button';
    props.id = 'cms-ui-color-theme';
    props.dataset = {};
    props.dataset.isCmsItem = "true";
    props.dataset.pluginJsonCmsBtnType = "colorThemeChange";
    props.dataset.isDarkMode = true;
    props.class = 'mat-icon cms-btn'
    props.template = require('./templates/cms-ui-color-theme-btn.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ["CHANNEL_PLUGIN_JSON_CMS_PLUGIN_CHANGE_COLOR_THEME_EVENT", "onColorModeChangeEvent"],
        ["CHANNEL_PLUGIN_CMS_CONFIG_EVENT", "onConfigEvent"]
    ];
  }

  toggleDarkMode(isDarkModeBool = true){


    const materialDarkClass = "material-symbols-outlined";
    const materialLightClass = "material-symbols-outlined";

    const classVal = isDarkModeBool === true ? materialDarkClass : materialLightClass;
    this.props.el$('span').setClass(classVal);

    this.props.el.dataset.isDarkMode = isDarkModeBool;

  }

  onColorModeChangeEvent(e){
    const {isDarkMode} = e.payload;
    //console.log('is darkMode ',{isDarkMode, e})
    this.toggleDarkMode(isDarkMode);
  }

  onConfigEvent(e){
    const {darkMode} = e.payload;
    this.toggleDarkMode(darkMode);
    //console.log('on config event',{darkMode,e});
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_PLUGIN_CMS_CONFIG")
    this.addChannel("CHANNEL_PLUGIN_JSON_CMS_PLUGIN");

  }

}
