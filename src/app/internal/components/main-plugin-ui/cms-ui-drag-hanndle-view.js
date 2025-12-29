import {ViewStream} from 'spyne';
import {SpynePluginCmsDragHandleTraits} from '../../traits/spyne-plugin-json-cms-ui-drag-handle-traits';
import {UtilTraits} from '../../traits/util-traits';

export class CmsUIDragHandleView extends ViewStream {

  constructor(props = {}) {
    props.traits = SpynePluginCmsDragHandleTraits;
    props.handleName = CmsUIDragHandleView.getHandlePositionName(props.handleType, props.handleIndex);
    props.class = `drag-handle ${props.handleType} ${UtilTraits.util$CamelToSnakeCase(props.handleName)} handle-index-${props.handleIndex}`
    const {handleName, handleType} = props;
    const isCmsItem = "true";
    props.dataset = {handleName, isCmsItem, handleType};
    super(props);

  }

  static getHandlePositionName(handleType='side', handleIndex=0){
    const handlesSideArr = ['top', 'right', 'bottom', 'left'];
    const handlesCornerArr = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft']
    const arr = handleType === 'corner' ? handlesCornerArr : handlesSideArr;
    return arr[handleIndex];
  }


  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {

  }

}
