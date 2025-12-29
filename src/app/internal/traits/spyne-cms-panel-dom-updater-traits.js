import {SpyneTrait} from 'spyne';
import {SpyneCmsProxyTraits} from './spyne-cms-proxy-traits';
import {SpyneCmsPanelDataObjectTraits} from './spyne-cms-panel-data-object-traits';
import {SpyneCmsPanelDataTraits} from './spyne-cms-panel-data-traits';
import {UtilTraits} from './util-traits';
import {ascend, descend, compose, concat, defaultTo, head, sort} from 'ramda';
let _incrementor = 1;

export class SpyneCmsPanelDomUpdaterTraits extends SpyneTrait {

  constructor(context){
    let traitPrefix = "spyneDomUpdater$";

    super(context, traitPrefix);
  }


  static spyneDomUpdater$DuplicateProperty(ddItem, rootData = this.props.data.rootData){



  }

  static spyneDomUpdater$GetPropertySelectorByData(cmsId, cmsKey){
    return  `[data-cms-id="${cmsId}"][data-cms-key="${cmsKey}"]`;
  }


  static spyneDomUpdater$GetCmsIdAndKey(el, el$){
    const getElFromSel = ()=>{
      const sel$ = el$!==undefined ? el$ : this.props.el$;
      return sel$(el).el;
    }

    const cmsEl = typeof(el)!=='string' ? el : getElFromSel();
    //const cmsId = 1;
    //const cmsKey = 2;
    const {cmsId, cmsKey} = cmsEl.dataset;
    return {cmsId, cmsKey};
  }

  static spyneDomUpdater$GetCmsValuesByCmsId(cmsId){
    _incrementor+=20
    //console.log("incrementor is ",_incrementor);

    //const cmsIdRE = /^(cms-\d{8}-)([01]+)(\d+)$/;
    const cmsIdRE = /^(cms-\d{8}-)(1)?([0]+)(\d+)$/;

    const matchArr = String(cmsId).match(cmsIdRE);

    const rootProxyId = matchArr[1];
    const iterCount = matchArr[4]*1;
    //const iterCount = this.spyneDomUpdater$GetNextCmsIdFromSiblings(cmsId);
    const iterMagnitude = 1;
    const parentDataId = cmsId;
    const iterStart = iterCount;
    return {rootProxyId, iterCount, iterMagnitude, iterStart, parentDataId};

  }

  static spyneDomUpdater$GetNextCmsIdFromSiblings(parentId, iterUpdate=20){
    const parentSelector = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetPropertySelectorByData(parentId, 'false');

    const re = /^(cms-\d{8}-)(1)?([0]+)(\d+)$/;
    const parentEl = document.querySelector(parentSelector);
    const siblingsArr  = Array.from(parentEl.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd"));

    const reduceToHighNum = (acc, el, i)=>{
      const {cmsId} = el.dataset;
      const matchArr = String(cmsId).match(re);
      const num = parseInt(matchArr[4]);
      acc = num>acc ? num : acc;
      //console.log("MATCH ",{cmsId, matchArr})
      //const iterCount = matchArr[3]*1;
      return acc;

    }
    const newCmsNum= siblingsArr.reduce(reduceToHighNum, 0)+iterUpdate;

    // return String(parentId).replace(re, `$1$2$3${newCmsNum}`)

    return newCmsNum;

  }

  static spyneDomUpdater$AppendNewPropertyGetAppendProps(propertyParams={}, props=this.props, testMode=false){

    const {moveElementId, moveElementType, activeElement, dataEvent} = propertyParams;

    //console.log("APPENDING ",{moveElementType})
    let {duplicateActiveElementBool, appendType} = propertyParams;

    const isMoveEvent = moveElementId!==undefined;
    let moveElement = false;
    let parentDataId, parentSelector;

    if (isMoveEvent===true){
      moveElement = props.el$(`#${moveElementId}`).el;
      duplicateActiveElementBool = true;
      // MOVE is always to moveElement && is always appendViewAfter
      //parentDataId = moveElement.dataset.cmsId;
      if (appendType === 'appendInto'){
        appendType = 'appendView';
        parentDataId = moveElement.dataset.cmsId;

      } else {
        parentDataId = moveElement.dataset.cmsType === "primitive" ? moveElement.dataset.parentCmsId : moveElement.dataset.cmsId;
      }

    } else if (isMoveEvent === false && appendType === 'appendInto'){
      appendType = 'appendView';
      parentDataId = activeElement.dataset.cmsId;
    } else {
      parentDataId = activeElement.dataset.parentCmsId;
    }



    duplicateActiveElementBool = duplicateActiveElementBool !== undefined ? duplicateActiveElementBool : isMoveEvent;

    parentSelector = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetPropertySelectorByData(parentDataId, 'false');
    /*
    * TODO: fix undefined cmsType
    * **/
    //console.log("parent sel is ",parentSelector, props.el$(parentSelector).exists);
    const parentElement = props.el$(parentSelector).el;
    const parentIsArray = parentElement.dataset.cmsType === 'array';
    const appendElement = isMoveEvent === true ? moveElement : activeElement;
    //console.log("APPEND TYPE BEFORE IS ",props.el, {parentSelector, parentElement, appendElement, isMoveEvent,appendType});

    appendType = appendType !== undefined ? appendType : parentElement !== appendElement || isMoveEvent === true ? "appendViewAfter" : "appendView";
    //console.log("APPEND TYPE AFTER IS ",appendType);

    const appendSelector = appendType === "appendView" ? parentSelector : `#${appendElement.id}`;

    return {isMoveEvent, moveElementType, activeElement, parentDataId,duplicateActiveElementBool, dataEvent, parentSelector, parentIsArray, appendType, appendSelector};


  }



  static spyneDomUpdater$AppendNewPropertyConformPropertyParams(propertyParams={}, props=this.props, testMode=false){
    let {activeElementId, moveElementId, dataEvent} = propertyParams;

    dataEvent = dataEvent || "primitive";

    //console.log("PROP PARAMS ",{activeElementId, moveElementId, dataEvent})


    //const activeElement = typeof(activeElementId) === 'string' ? props.el$(`#${activeElementId}`).el : false;
    const activeElement = typeof(activeElementId) === 'string' ? document.querySelector(`#${activeElementId}`) : false;

    //console.log("ACTIVE ELMENET :",{activeElementId, activeElement})

    const checkForErrors = ()=>{
      const validDataEvents = ['primitive', 'object', 'array', 'duplicate'];
      if (validDataEvents.includes(dataEvent) === false){
        console.warn(`The following dataEvent, ${dataEvent}, is not valid: propertyParams:${JSON.stringify(propertyParams)}` );
      }

      if (activeElement === false){
        console.warn(`The following activeElementId, ${activeElementId}, is not valid: propertyParams:${JSON.stringify(propertyParams)}` );

      }


    }

    if (testMode === false){
      checkForErrors();
    }

    if (activeElement === false){
      return {activeElementId, moveElementId, dataEvent, activeElement};
    }

    const duplicateActiveElementBool = dataEvent === 'duplicate';

    return {activeElementId, moveElementId, dataEvent, activeElement, duplicateActiveElementBool};
  }

  static spyneDomUpdater$GetElementKey(el){
    //console.log("GET KEY IS ",{el})
    const isContainer = String(el.dataset.isContainer) === "true";
    const keySel = isContainer === true ? '.cms-key input' : 'label input';

    const elLabel = el.querySelector(keySel).value;
    // console.log("item is ",{isContainer,elLabel, keySel, el})

    return elLabel;

  }


  static spyneDomUpdater$GetNewPropertyCmsKey(appendProps = {}, props=this.props){
    let newKey = "newKey";
    const {parentSelector,duplicateActiveElementBool,cmsType,isMoveEvent,moveElementType, appendType, activeElement} = appendProps;
    let {parentIsArray} = appendProps;


    //String(temp1.dataset.isContainer) !== 'true'


    const parentEl = props.el$(parentSelector).el;

    const _parentIsArr = parentIsArray !== undefined ? parentIsArray : parentEl !== undefined && parentEl.dataset.cmsType==='array';


    //const parentChildrenArr = Array.from(parentEl.querySelectorAll(":scope  .spyne-cms-property-container > dd"));
    const parentChildrenArr = Array.from(parentEl.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd"));

    //console.log('parent children arr ', {moveElementType, parentEl,parentChildrenArr})
    const mapLabels = (dd)=> {

      const label = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetElementKey(dd);
      //console.log('label is ',label);
      return label;

    }


    const getNonArrayKey = ()=>{


      const labelsArr = parentChildrenArr.map(mapLabels);
      //console.log("NEW KEY IN METHOD ",newKey, labelsArr);

      const newKeyStr = `^(${newKey})(\d+)$`;
      const newKeyMatchStr = `^(((${newKey})(\\d+))|(.*))$`;

      const newKeyRE = new RegExp(newKeyStr, 'gm');
      const newKeyREMatch = new RegExp(newKeyMatchStr, 'gm');

      //const newKeyRE = /^(newKey)(\d+)$/gm;
      // const newKeyREMatch = /^(((header)(\d+))|(.*))$/gm;


      const getKeyLabelNums = (acc, labelStr) => {
        let numVal = String(labelStr) === newKey ? 0 : String(labelStr).replace(newKeyREMatch, "$4");
        // console.log("num Val ", {labelStr, numVal}, newKeyREMatch);
        if (UtilTraits.util$Exists(numVal) === true){
          acc.push(String(parseInt(numVal)+1));
        }
        return acc;

      }
      //labelsArr.push('newKey');
      //labelsArr.push('header2');
      //labelsArr.push('header3');
      let reduceLabelsArr = labelsArr.reduce(getKeyLabelNums, []);

      let finalLabel = compose( concat(`${newKey}`), defaultTo(''),head,sort(descend()))(reduceLabelsArr.reverse());


      //console.log("final label ", finalLabel, reduceLabelsArr);
      return finalLabel;

    }

    const getNextIndexOfActiveElement = (el)=>Number.parseInt(parentChildrenArr.indexOf(el)+1);


    const dupeKeyForMoveEvent = _parentIsArr === false && isMoveEvent === true && appendType === "appendViewAfter" && activeElement!==undefined && activeElement.nodeType===1;

    //console.log("GET KEY PROPS ", {parentSelector, dupeKeyForMoveEvent, isMoveEvent, _parentIsArr, appendType, appendProps});


    if (dupeKeyForMoveEvent === true){
      const isPrimitiveVal = activeElement!== undefined && String(activeElement.dataset.isContainer) !== 'true' ? "primitive" : "object";

      //console.log("DUPE MOVE ",{moveElementType, cmsType, isPrimitiveVal})

      newKey = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetKeyFromDom(activeElement, isPrimitiveVal);

      const moveDD = activeElement.parentElement.closest('dd');
      const moveToSameParent = moveDD === parentEl;

      return moveToSameParent === true ? newKey : getNonArrayKey();

      //return getNonArrayKey();

    } else if (_parentIsArr === true){
      return appendType === "appendViewAfter" ?  getNextIndexOfActiveElement(activeElement) : parentChildrenArr.length;
    } else if (_parentIsArr !== true && duplicateActiveElementBool === true) {
      //console.log('get key call ', {newKey,activeElement});
      newKey = UtilTraits.util$Exists(newKey) === false ? newKey : SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetElementKey(activeElement);
      //console.log("GET THE KEY IS ",newKey)

    }

    return getNonArrayKey();


  }

  static spyneDomUpdater$CreateNewProxyProp(type='primitive', rootData={rootProxyId: SpyneCmsProxyTraits.spyneCms$GenerateRootProxyId()}){
    const propData = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetNewPropData(type);


    const proxyProperty = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(propData, rootData);

    return {proxyProperty, rootData};
  }



  static spyneDomUpdater$GetNewPropertyCmsVal(appendProps = {}, props=this.props) {
    const {activeElement,parentDataId,dataEvent, duplicateActiveElementBool, appendType} = appendProps;

    //spyneCmsPanelDataObj$AddProps
    //console.log('active element is ',parentDataId, appendProps);


    let cmsVal = "value";

    const getContainerCmsVal = ()=>{
      const rootData = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsValuesByCmsId(parentDataId);
      // rootData.iterStart = this.spyneDomUpdater$GetNextCmsIdFromSiblings(parentDataId);

      let cmsValDataFn = ()=>{
        return  SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(activeElement);
      }

      const cmsValHash = {
        "primitive" : ()=>"value",
        "array" : ()=>[],
        "object" : function(){return {}}
      }
      let cmsValData = "missing";

      if (duplicateActiveElementBool === true) {
        cmsValData = cmsValDataFn()

        //console.log("CMS DUPE ",rootData)

      } else if (['object', 'array'].includes(dataEvent)){


        cmsValData = dataEvent === "array" ? {key: []} : {key: {}};
        //console.log("GET DAT ELEMENT ",cmsValData)
      }

      //console.log('cms val data ',{cmsValData, rootData})
      // RETURN JUST THE PROXY VAL AND NOT THE OLD CMS KEY
      let proxyKeyVal;
      /*        if (['object', 'array'].includes(dataEvent) === true){
                 proxyKeyVal = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(cmsValData, rootData);
                return proxyKeyVal[0];
              }*/
      [proxyKeyVal] = Object.entries(SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(cmsValData, props.rootData));
      const [cmsKey, cmsVal] = proxyKeyVal;
      //console.log('cms val data ',{proxyKeyVal, cmsKey, cmsVal})

      //return {[cmsKey]:cmsVal};
      return cmsVal;


      // const [proxyKeyVal] = Object.entries(SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(cmsValData, rootData));
      // proxyKeyVal = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(cmsValData, rootData, true);
      // console.log('proxy key val is ',{proxyKeyVal, cmsValData, rootData})
      //const [cmsKey, cmsVal] = proxyKeyVal;
      //console.log('cms val data ',{proxyKeyVal, cmsKey, cmsVal})

      // return cmsVal;

    }

    return dataEvent === "primitive" ? "value" : getContainerCmsVal();



  }


  static spyneDomUpdater$GetAppendParams(propertyParams = {}, props=this.props){
    //console.log('props is ',props);

    const {activeElementId, duplicateActiveElementBool,moveElementId, dataEvent, activeElement} = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyConformPropertyParams(propertyParams, props);



    const appendProps = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyGetAppendProps({activeElement,appendType:propertyParams.appendType, moveElementId,moveElementType:propertyParams.moveElementType,duplicateActiveElementBool, dataEvent}, props);
    const {parentDataId} = appendProps;

    const cmsKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsKey(appendProps, props);

    /**
     * TODO: cmsKey, cmsVal, isContainer, parentDataId
     * TODO: If not primitive str, then proxify, either {}, [] or duplicate
     * TODO: checks for cmsVal are: 1-primitive="the string" 2-empty{}or{}="proxify it" 3-duplicateOrMove="proxify dataObj && confirm parent level" -- then props = {cmsKey, cmsVal, isContainer, parentDataId}
     *
     * */

    let {appendType,appendSelector} = appendProps;


    appendSelector = appendType === "appendViewAfter" ? appendSelector : `${appendSelector} dl .spyne-cms-property-container`;

    // const appendType = appendType !== undefined ? appendType : appendProps.appendType;

    const cmsVal = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsVal(appendProps, props);



    const isContainer =  UtilTraits.util$GetType(cmsVal) !== 'primitive';
    //console.log('append props1 is ',typeof cmsVal, {duplicateActiveElementBool,cmsVal,cmsKey,dataEvent, parentDataId},appendProps.dataEvent);

    const itemProps  =  {cmsKey, cmsVal, parentDataId, isContainer};
    //console.log('append selector items ',{itemProps, appendType, appendSelector});


    return {itemProps, appendType, appendSelector} ;

  }




  static spyneDomUpdater$AddNewProperty(appenderCmsId, appenderCmsKey,  newPropType){

    // container properties have the cmsKey set to "false"
    const appenderIsContainer = String(appenderCmsKey) === "false";
    const appendMethod = appenderIsContainer === true ? "appendView" : "appendViewAfter";
    const appenderSelector = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetPropertySelectorByData(appenderCmsId, appenderCmsKey);

    const parentContainerSelector = appenderIsContainer === true ? appenderSelector : SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetPropertySelectorByData(appenderCmsId, 'false');


    const {rootProxyId, iterCount, iterMagnitude, parentDataId} = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsValuesByCmsId(appenderCmsId);



    //const cmsKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyKey({activeItem})






    /**
     * SEVERAL THINGS HAPPENING
     * The cms item that is calling to create another cms item
     *
     * data to add object
     * figure out whether to append or appendViewAfter
     * figure out the parent
     *
     * data to create object
     * rootProxyId, iterValues parentDataId
     * see below to figure out values by type
     *
     *
     *
     * */


    /**
     *
     * const re = /^(cms-\d{8})(-0+)(\d+)$/
     * idMap
     *
     * primitive
     * cmsId parenCmsId
     * cmsVal - ""
     * cmsKey - check newKey parent props
     *
     * object
     * cmsId - new - iterStart, iterMagnitude
     * cmsVal - {}
     * cmsKey - check newKey parent props
     *
     * array
     * cmsId - new - iterStart, iterMagnitude
     * cmsVal - []
     * cmsKey - check parent childElementsCount
     *
     * duplicate
     *   - appenderSelector
     *     - cmsVal
     *       - primitive
     *          - appenderSelector - cmsVal
     *        - isContainer
     *          - appenderSelector el to Data, SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom
     *            - proxify data
     *      - cmsKey
     *        check parent newKey props or check parents childElementsCount
     *
     *
     * */


    // RETURN  PRIMTIVE-OBJ-ARRAY DATA


    return {appenderIsContainer, appendMethod, appenderSelector, rootProxyId, iterCount, iterMagnitude, parentDataId};

    //SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$CreateNewProxyProp

  }








}

