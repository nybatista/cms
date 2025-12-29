import {SpyneTrait, SpyneAppProperties} from 'spyne';
import {move,prop} from 'ramda';

export class SpynePluginCmsUITraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'spyneCms$';
    super(context, traitPrefix);
  }


  static spyneCms$SendCMSChannelName(cmsChannelName){
    const channelName = "CHANNEL_SPYNE_JSON_CMS_DATA";
    const action = "CHANNEL_SPYNE_JSON_CMS_DATA_MANAGE_CMS_DATA_EVENT";
    //console.log('this main plug is ', cmsChannelName);
    this.sendInfoToChannel(channelName, {cmsChannelName}, action);
  }

  static spyneCms$GetPluginName(){
    return 'spyneCms';
  }

  static spyneCms$GetMainChannelName(){
    return "CHANNEL_PLUGIN_JSON_CMS_PLUGIN"
  }
  static spyneCms$UpdatePosition(arr=this.props.config.position, el$=this.props.el$){
    const posArr = arr.slice(0, 2);
    posArr.forEach(c => el$.addClass(c))
    return posArr;
  }

  static spyneCms$GetMenuData(allChannelsArr){
    const mapMenuData = (str)=> {
      const channelLower = String(str).toLowerCase();
      const channelName = channelLower.replace(/^(channel_)(.*)$/, '$2');
      const channelTitle = channelName.toUpperCase();
      return {channelLower, channelName, channelTitle}

    }

    const menuChannelData = allChannelsArr.map(mapMenuData);
    return menuChannelData;

  }


  static spyneCms$SetAvailableChannels(spyneApp, excludeChannelsArr=['CHANNEL_PLUGIN_JSON_CMS_PLUGIN', "DISPATCHER"]){
    const app = spyneApp || prop('Spyne', window);
    const allChannelsArr = SpyneAppProperties.listRegisteredChannels();
    const channelsReducer = (acc, val) =>{
      if (excludeChannelsArr.indexOf(val)<0){
        acc.push(val);
      }
      return acc;
    }
    let interimAllChannelsArr = allChannelsArr.reduce(channelsReducer, []);
    return move(0, 2, interimAllChannelsArr);
  }

}
