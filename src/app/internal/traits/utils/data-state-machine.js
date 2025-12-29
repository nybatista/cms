import {compose, clone, reject, uniq, equals, defaultTo, isNil, map} from 'ramda';
import {UtilTraits} from '../util-traits';

let _elementsArr = [];
let _elementsKeysArr = [];
let _dataHasUpdated = false;
let _dataHasUpdatedPrev = false;
let _stateChanged = false;
let _alteredItems = [];
let _rootProxyIds = [];


export class DataStateMachine {

  constructor() {


  }


  update2(valChangedBool, vsid, isKey=false){
    const removePred = str => str === vsid;
    const removeMethodFn = (arr) => compose(reject(removePred), uniq)(arr);
    const addMethodFn = (arr) => {
      _elementsKeysArr.push(vsid);
      return uniq(arr);
    }

    const fn = String(valChangedBool) === "true" ? addMethodFn : removeMethodFn;
    if (isKey === false) {
      _elementsArr = fn(_elementsArr);
    } else {
      // _elementsKeysArr = fn(_elementsKeysArr);
      //console.log("ELEMENTS KEY ARR IS ",{valChangedBool, vsid, isKey},_elementsKeysArr)
    }
    return this.status;
  }



  update(valChangedBool, vsid){
    const removePred = str => str === vsid;
    const removeMethodFn = (arr) => compose(reject(removePred), uniq)(arr);
    const addMethodFn = (arr) => {
      _elementsArr.push(vsid);
      return arr;
    }

    const fn = String(valChangedBool) === "true" ? addMethodFn : removeMethodFn;
    _elementsArr = fn(_elementsArr);
    return this.status;
  }


  upldatedAlteredItems(vsid, operation='added'){
    // ADDED, REMOVED, DELETED, MOVED
    const rejectPred = s=>s===vsid;

    const methodHash = {
      'added' : ()=>_alteredItems.push(vsid),
      'removed' : ()=>reject(rejectPred, _alteredItems),
      'deleted' : ()=>_alteredItems.push(vsid),
      'moved' : ()=>_alteredItems.push(vsid),
      'returned' : ()=>reject(rejectPred, _alteredItems),

    }
    const operationFn = methodHash[operation];
    operationFn(vsid);

    return this.status;


  }

  reset(){
    _elementsArr = [];
    return this.status;
  }

  get dataStateChanged(){
    return _stateChanged;
  }

  get state(){
    return _stateChanged;
  }

  get dataHasUpdated(){
    return _dataHasUpdated;
  }

  get status(){
    _dataHasUpdated = _elementsArr.length>=1 || _alteredItems.length>=1 ;
    _stateChanged = _dataHasUpdated !== _dataHasUpdatedPrev;
    _dataHasUpdatedPrev = _dataHasUpdated;
    return _dataHasUpdated;
  }

  get elements(){
    return clone(_elementsArr);
  }

  get rootProxyIds(){
    const getRootProxyIdFn = UtilTraits.util$GetRootProxyId;

    const rejectNil = reject(equals(isNil))

    const mapVsidsToRootProxyIds = (vsid)=>{
      const el = document.querySelector(`#${vsid}`);
      if (el === null){
        //console.log("EL IS NULL ",{vsid, _elementsArr});
        return "00000";
      }
      const {cmsId} = el.dataset;
      return getRootProxyIdFn(cmsId);
    }
    _rootProxyIds = compose(uniq, rejectNil, map(mapVsidsToRootProxyIds), defaultTo([]))(_elementsArr);
    return _rootProxyIds;
  }


}
