import {SpyneTrait} from 'spyne';
import DOMPurify from 'dompurify';
const {clone, path} = require('ramda');
const cmsPropPrefix = "__cms__";
const _cmsIdPrefix = "cms-";

const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    // Only sanitize if it looks like it might contain HTML
    if (val.includes('<') && val.includes('>')) {
      return DOMPurify.sanitize(val, {
        ALLOWED_TAGS: false,     // allow default safe list only
        ALLOWED_ATTR: false,     // allow default safe attributes only
        FORBID_ATTR: ['onerror','onload','onclick','onmouseover','onfocus','onblur'],
        FORBID_TAGS: ['style','script','iframe','object','embed','form','input']
      });
    }
  }
  return val;
};


const _proxyName = "spyneCmsProxyData";

export class SpyneCmsProxyTraits extends SpyneTrait {

  constructor() {
    let traitPrefix = "spyneCms$";

    super(context, traitPrefix);


  }



  static spyneCms$GetNestedLevelByMap(idMap){
    const reduceToMaxNestedNum = (acc, arr) => {
      const len = arr[1] !== undefined && arr[1].length > 0 ? arr[1].length : 0;
      acc = len>acc ? len : acc;
      return acc;
    }
    return Array.from(idMap).reduce(reduceToMaxNestedNum, -1);
  }



  static spyneCms$GetFileName(str){

    const re = /(.*(\/|%2F))([\w\-_.]+\.\w{2,6})/gm;
    const fileName = String(str).replace(re, "$3");

    if (re.test(str)===false){
      //console.error('filename appears to be malformed ',{fileName})
    }

    return fileName;
  }


  static spyneCms$GenerateBaseRootData(){
    const idMap = new Map();
    const rootProxyId = SpyneCmsProxyTraits.spyneCms$GenerateRootProxyId();
    return {rootProxyId, idMap}

  }

  static spyneCms$GenerateRootProxyId(){
    return SpyneCmsProxyTraits.spyneCms$GenerateFileId(_cmsIdPrefix);
  }



  static spyneCms$MapData(data, metadata){
    const {channelName, url} = metadata;

    const rootProxyId = SpyneCmsProxyTraits.spyneCms$GenerateRootProxyId();
    const fileUrl = url;
    const fileName = SpyneCmsProxyTraits.spyneCms$GetFileName(fileUrl);
    const rootData = {channelName, fileUrl, fileName, rootProxyId};

    //console.log("FILE PROXY INFO ",{rootProxyId, fileUrl, fileName, rootData})


    return SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(data, rootData);

  }


  static spyneCms$ProxyMap(channelName, url){
    const rootProxyId = SpyneCmsProxyTraits.spyneCms$GenerateFileId(_cmsIdPrefix);
    const fileUrl = url;
    const fileName = SpyneCmsProxyTraits.spyneCms$GetFileName(fileUrl);




    /**
     *
     * TODO: CREATE CHANNEL_CMS_DELEGATOR
     *
     * TODO: create ChannelCmsDelegatorTraits
     *
     * TODO: generate delegatorCMSMainMap
     *
     * TODO: Channel listens for CHANNEL_CMS_DELEGATOR_TRACK_PROXY_CMS_DATA_EVENT
     *
     * payload {channelName, fileUrl, fileName, fileRootId, originalObj, proxifiedObj, dataMap}
     *
     * TODO: **** SEND ONLY CHANNEL NAME **** DELEGAGTOR PICKS UP EVERTYHING ELSE AFTER MAP THROUGH getChannel
     * TODO: **** UPON FIRST RECEIVE, CLONES DATA, COLLECTS MAP, FILENAME FILEURL, ROOT ID THE REST TO MASTER MAP
     *
     * */

    const rootData = {channelName, fileUrl, fileName, rootProxyId};

    return (obj)=>{
      return SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(obj, rootData);
    }



  }

  static spyneCms$CreateProxyRootObj(obj, url){
    const rootProxyId = SpyneCmsProxyTraits.spyneCms$GenerateFileId();
    const fileUrl = url;


    return obj;
  }


  static spyneCms$GenerateFileId(){
    function uuid() {
      return String(crypto.getRandomValues(new Uint16Array(1))).padEnd(8,'0');
    }

    return `${_cmsIdPrefix}${uuid()}-`;
  }

  static spyneCms$GenerateCmsId(n, cmsId=_cmsIdPrefix){
    return `${cmsId}${String(n).padStart(10, '0')}`;
  }

  static spyneCms$GetPropType(prp){
    let type = typeof prp;
    if (['number', 'boolean', 'string'].includes(type)){
      type = 'primitive';
    } else if (type==='object'){
      if (Array.isArray(prp)){
        type = 'array'
      } else if (prp===null){
        type = 'undefined';
      }
    }
    return type;
  }


  static get spyneCms$ProxyName(){
    return _proxyName;

  }


  static spyneCms$SanitizeObj(input) {
    const sanitizeStr = (s) =>
      DOMPurify.sanitize(s, {
        FORBID_TAGS: ['script',  'object', 'embed', 'form', 'meta'],
        // ADD TAGS FOR CMS
        ADD_TAGS: ['iframe', 'input', 'button', 'link',],
        // Remove any inline JS attributes
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
        ALLOW_DATA_ATTR: false
      });

    if (Array.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        if (typeof input[i] === 'string') {
          input[i] = sanitizeStr(input[i]);
        }
      }
      return input;
    }

    if (input && typeof input === 'object') {
      for (const k in input) {
        if (!Object.prototype.hasOwnProperty.call(input, k)) continue;
        if (typeof input[k] === 'string') {
          input[k] = sanitizeStr(input[k]);
        }
      }
    }

    return input;
  }



  static spyneCms$CreateCmsProxyObjOrArr(obj, cmsHash={}){

    obj = SpyneCmsProxyTraits.spyneCms$SanitizeObj(obj);


    const cmsRE = /^(__cms__)/;
    const proxyRE = /^(__proxy__)/;

    const {_type, _dataPath, _iter, _proxyName, xtraProps} = cmsHash;

    let {__cms__mapArr} = cmsHash || [];

    const __proxy__isProxy = true;
    const __proxy__proxyName = _proxyName;
    const __proxy__props = cmsHash;


    const proxyHash = {__proxy__isProxy, __proxy__proxyName, __proxy__props};

    if (_type==='array'){
      // CREATE A MAP ARRAY TO KEEP TRACK OF ORIGINAL INDEX POSITIONS
      const createKeyValObjReducer = (acc, o, i) => {
        const itemType = typeof o;
        if (['number', 'boolean', 'string'].includes(itemType)) {
          const origProp = o;
          const key = String(i);
          const val = o;
          acc.push({key,val})
        }
        return acc;
      }
      __cms__mapArr = obj.reduce(createKeyValObjReducer, []);
    }



    const arrHandler =  {

      getValByKey: function(target, prop){
        // GET THE REQUESTED KEY OR VAL TYPE FOR ORIGINAL PRIMITIVE ELEMENT

        //const propRE = /(__cms__)(\w{3})(\w+_)(\w+)/m;
        const propRE = /(__cms__)(\w{3})(\w+_)([^\s])/m;
        try {
          const [str, m1, propType, m2, propValue] = String(prop).match(propRE)
          const searchByType = propType === 'key' ? 'val' : 'key';

          const filterItems = (o) => typeof o === 'object' &&
              o[searchByType] === propValue;
          const item = __cms__mapArr.filter(filterItems);

          return item[0] ? item[0][propType] : target[prop];
        } catch (e){
          console.warn(`string not iterable at —\n${prop}\n—`)
          return false;
        }

      },


      get(target, prop) {

        if (typeof target[prop] === 'function') {
          const val = target[prop];
          if (['push', 'unshift'].includes(prop)) {
            return function (el) {
              return Array.prototype[prop].apply(target, arguments);
            }
          }
          if (['pop'].includes(prop)) {
            return function () {
              const el = Array.prototype[prop].apply(target, arguments);
              return el;
            }
          }
          return val.bind(target);
        }



        const propString = String(prop);

        // IF THIS IS A __cms__ prop
        if (cmsRE.test(propString)){
          // IF THIS IS A __cms__keyFor or __cms__valFor prop
          if(/(\w{3}For)/.test(propString)){
            return this.getValByKey(target, prop);
          }
          return cmsHash[prop];
        } else if (proxyRE.test(propString)){
          return proxyHash[prop];
        }
        return target[prop];
      }
    }


    const containerHandler = {
      set(target, prop, val) { // to intercept property writing
       // console.log("PROP VAL IS ",{prop,val}, Object.isFrozen(this), Object.isFrozen(target))

        if (Object.isFrozen(target)){

          if (xtraProps!==undefined) {
            xtraProps[prop] = val;
          }
        } else {
          target[prop] = val;
        }
        return true;
      },


      get(target, prop, targetProxy){
        const propString = String(prop);
        if (typeof target[prop] === 'function'){
          const val = target[prop];
          return  val.bind(target)

        } else if (cmsRE.test(propString)){
          return cmsHash[prop];
        } else if (proxyRE.test(propString)){
          return proxyHash[prop];
        }

        return  target[prop];
      }
    }

    const handler = _type === 'object' ? containerHandler : arrHandler;

    return new Proxy(obj, handler);

  }


  static spyneCms$CreateProxyParams(obj, dataPath, type='object', iter, cmsId=_cmsIdPrefix, rootData){

      const _iter = iter;
      const _type = type;
      const _dataPath = dataPath;

      const __cms__isProxy = true;
      const __cms__dataPath = _dataPath;

      const __cms__dataId = SpyneCmsProxyTraits.spyneCms$GenerateCmsId(_iter, cmsId);

      const __cms__rootData = rootData;

      const __cms__type = _type;


    const cmsHash = {__cms__isProxy,__cms__dataPath, __cms__rootData, __cms__dataId,__cms__type,_type, _proxyName, _dataPath, _iter};
    const cmsRE = /^(__cms__)/;




    return  SpyneCmsProxyTraits.spyneCms$CreateCmsProxyObjOrArr(obj, cmsHash);


  }

  static spyneCms$ProxifyJsonData(
    origObj,
    rootData = { rootProxyId: SpyneCmsProxyTraits.spyneCms$GenerateRootProxyId() }
  ) {
    const jsonObj = clone(origObj);
    const cmsPrefix = rootData.rootProxyId;


    // Initialize idMap if not present
    if (rootData.idMap === undefined) {
      rootData.idMap = new Map();
    }

    const { idMap } = rootData;
    let iter = rootData.iterStart !== undefined ? rootData.iterStart : idMap.size;
    const iterMagnitude =
      rootData.iterMagnitude !== undefined ? rootData.iterMagnitude : 1000;

    /**
     * Sanitizes only string values that could contain HTML
     * Does NOT touch CMS metadata props or plain text
     */


    const proxyIterable = (iterObj, iterPath = []) => {
      for (const [key, prop] of Object.entries(iterObj)) {
        // Skip reserved CMS keys
        if (key.startsWith('__cms__')) continue;

        const type = SpyneCmsProxyTraits.spyneCms$GetPropType(prop);
        const clonedPath = [...iterPath, key];

        if (type === 'object' || type === 'array') {
          iter++;
          iterObj[key] = SpyneCmsProxyTraits.spyneCms$CreateProxyParams(
            iterObj[key],
            clonedPath,
            type,
            iter * iterMagnitude,
            cmsPrefix
          );
          idMap.set(`${iterObj[key].__cms__dataId}`, clonedPath);
          proxyIterable(prop, clonedPath);
        } else if (type === 'string') {
         // if(prop.includes('a')){
        //  }
          iterObj[key] = sanitizeValue(prop);
        }
      }
    };

    proxyIterable(jsonObj);

    return SpyneCmsProxyTraits.spyneCms$CreateProxyParams(
      jsonObj,
      [],
      'object',
      0,
      cmsPrefix,
      rootData
    );
  }



  static spyneCms$DataReviverCreateArr(proxyObj = {}){
    const {__proxy__isProxy} = proxyObj;

    if (__proxy__isProxy !==true){
      console.error('Reviving Object is not a cms proxy object', proxyObj)
    }

    const dataPathArr = [];

    const proxyIterable = (iterObj, reducedObjPath) => {
      let objPath = reducedObjPath || [];
      const loopObj = ([key, prop]) => {
        const type = SpyneCmsProxyTraits.spyneCms$GetPropType(prop);
        const clonedPath = [...objPath]
        clonedPath.push(key);
        if (type==='object' || type ==='array') {
          dataPathArr.push(clonedPath);
          proxyIterable(prop, clonedPath)
        }
      }
      Object.entries(iterObj).forEach(loopObj);
    }

    proxyIterable(proxyObj);
    return dataPathArr.reverse();
  }





  static spyneCms$DataReviveNestedProxyObj(proxyObj){


    const {__proxy__proxyName} = proxyObj;

    if (__proxy__proxyName === undefined){
      console.error('object is not proxy object ',proxyObj);
    }

    //console.log('proxy name is ',__proxy__proxyName);

    const cloneNestedProxyObj = (target, pathArr)=>{
     const nestedProxyObj = path(pathArr, proxyObj);
     const {__proxy__isProxy, __proxy__props} = nestedProxyObj;
      return __proxy__isProxy ? SpyneCmsProxyTraits.spyneCms$CreateCmsProxyObjOrArr(target, __proxy__props) : target;
    }


    const rootObj = cloneNestedProxyObj(clone(proxyObj), []);


    const proxyIterable = (iterObj, iterPath) => {
          let dataPath = iterPath || [];
          const loopObj = ([key, prop]) => {
            const type = SpyneCmsProxyTraits.spyneCms$GetPropType(prop);
            const clonedPath = [...dataPath]
            clonedPath.push(key);
            if (type === 'object' || type==='array') {
                iterObj[key] = cloneNestedProxyObj(prop, clonedPath);
              proxyIterable(prop, clonedPath)
            }
          }
          Object.entries(iterObj).forEach(loopObj);
        }

    proxyIterable(rootObj);
    // console.timeEnd('proxify2');


    return rootObj;


  }






}
