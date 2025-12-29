import {ViewStream} from 'spyne';
import {CmsSelectItemBoxTraits} from '../../traits/cms-select-item-box.traits';

export class CmsItemTextUpdater extends ViewStream {

    constructor(props={}) {
      // THIS IS A NULL APPENDED ITEM THAT CHECKS DOCUMENT FOR ANY INPUT MATCHED CMS ITEMS

        super(props);
    }

    addActionListeners() {
        // return nexted array(s)
        return [
            ["CHANNEL_CMS_ITEMS_FOCUS_EVENT", "onCmsItemsUpdatedEvent"]
        ];
    }

    onCmsItemsUpdatedEvent(e){

      const {textUpdated, textVal, cmsId, cmsKey} = e.payload;

      const itemsEl = CmsSelectItemBoxTraits.cmsSelectItem$GetSelectedItems(cmsId, cmsKey);

      //console.log('items el is ',{itemsEl, textVal})

      if(textVal!==undefined){
         CmsSelectItemBoxTraits.cmsSelectItem$UpdateCmsItems(Array.from(itemsEl), textVal);
      }



    }

    broadcastEvents() {
        // return nexted array(s)
        return [];
    }

    onRendered() {
      //console.log('text updater added ',this.props.el);
      this.addChannel("CHANNEL_CMS_ITEMS");
    }

}

