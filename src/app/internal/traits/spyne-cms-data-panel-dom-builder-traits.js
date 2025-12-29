import {SpyneTrait} from 'spyne';
import {path} from 'ramda';
import {SpyneCmsPanelDataPropertyTraits} from './spyne-cms-panel-data-property-traits';

export class SpyneCmsDataPanelDomBuilderTraits extends SpyneTrait {

  constructor(context){
    let traitPrefix = "spyneCMSDomBuilder$";

    super(context, traitPrefix);
  }

  static spyneCMSDomBuilder$HelloWorld(){
    return "Hello World";
  }


  static spyneCMSDomBuilder$SortIdMapByLength(arrPairs){

    const comparator = (a, b)=>a[1].length - b[1].length;

    return arrPairs.sort(comparator).reverse();

  }

  static spyneCMSDomBuilder$GetDataIdMapArr(idMapArrPair, proxyObj){
    return path(idMapArrPair[1], proxyObj);
  }

  static spyneCMSDomBuilder$ConformPropData(props){
    props.data = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConformPropData(props);

  }

  static spyneCMSDomBuilder$ConvertObjToDom(dataObj={}){
  }

  static spyneCMSDomBuilder$CreateStringOrganizer(){

    class SelfDeletingObject {
      constructor() {
        this.data = {};
      }

      set(key, value) {
        this.data[key] = value;
      }

      get(key) {
        const value = this.data[key];

        delete this.data[key];
        return value;
      }
    }

    return new SelfDeletingObject();

  }

}

