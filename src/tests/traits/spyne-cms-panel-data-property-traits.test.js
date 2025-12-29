const {expect, assert} = require('chai');
const {SpyneCmsProxyTraits} = require('../../app/internal/traits/spyne-cms-proxy-traits');
const {nestedObj} = require('../mocks/nested-data-obj');


const fileUrl = "http://localhost:8078/public/data/mock-app-data.json";
const channelName = "CHANNEL_MY_CHANNEL";


const proxyMapFn = SpyneCmsProxyTraits.spyneCms$ProxyMap(channelName, fileUrl);

const proxyObj = proxyMapFn(nestedObj);
const nestedProxyObj = R.path(['level1', 'level2'], proxyObj);

const {SpyneCmsPanelDataPropertyTraits} = require('../../app/internal/traits/spyne-cms-panel-data-property-traits')

describe('should run tests for SpyneCmsPanelDataPropertyTraits', () => {

  it('should exist, SpyneCmsPanelDataPropertyTraits', () => {
    expect(SpyneCmsPanelDataPropertyTraits).to.exist;
  });

  it('should return dataId and cmsKey or default', ()=>{
    return true;
  })

  it('should get own dataId and no key when object',()=>{
    const proxyObjDataId = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$GetDataId(nestedProxyObj);
    const {__cms__dataId} = nestedProxyObj;
      expect(proxyObjDataId).to.eq(__cms__dataId);
  })

  it('should return false for dataId and no key when item is object and data is not proxy', ()=>{

    const nonProxyObj = Object.assign({}, nestedProxyObj);
    const nonProxyObjDataId = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$GetDataId(nonProxyObj);

    expect(nonProxyObjDataId).to.be.false;

  })



  it('should get parent dataId and own key when item is property', ()=>{
      const {level3} = nestedProxyObj;
      const {finalStr} = level3;
      const {__cms__dataId} = level3;
      const proxyPropDataId = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$GetDataId(finalStr, __cms__dataId);
      expect(proxyPropDataId).to.eq(__cms__dataId);

  })



  it('should return false for dataId and own key when item is property and data is not proxy', ()=>{
    const nonProxyObj = Object.assign({}, nestedProxyObj);
    const {level3} = nonProxyObj;
    const {finalStr} = level3;
    const nonProxyPropDataId = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$GetDataId(finalStr);
    expect(nonProxyPropDataId).to.be.false;
  })



});


describe('should convert values to the correct type ',()=>{

  it('should convert a string to other types ',()=>{

    const strToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("234.3asdf", "number");
    const strToBoolean = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("false", "boolean");
    const strToNull = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("234.3asdf", "null");
    const hexToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(0x33ccff, "number");

    expect(strToNumber).to.eq(234.3);
    expect(strToBoolean).to.be.false;
    expect(strToNull).to.be.null;
    expect(hexToNumber).to.eq(3394815);

  })

  it('should convert other types to string',()=>{

    const numberToStr = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(234, "string");
    const boolToStr = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(false, "string");
    const nullToStr = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(null, "string");

    expect(numberToStr).to.eq("234");
    expect(boolToStr).to.eq('false');
    expect(nullToStr).to.eq('null');

  });

  it('should convert types to number',()=>{

    const strToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("23423das", "number");
    const boolTrueToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(true, "number");
    const boolTrueStrToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("true", "number");
    const boolFalseToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(false, "number");
    const nullToNumber = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(null, "number");

    expect(strToNumber).to.eq(23423);
    expect(boolTrueToNumber).to.eq(1);
    expect(boolTrueStrToNumber).to.eq(1);
    expect(boolFalseToNumber).to.eq(0);
    expect(nullToNumber).to.eq(0);

  });

  it('should convert types to Boolean', ()=>{
    const strTrueToBool =        SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("true", "boolean");
    const strTrueUpperToBool =    SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("TRUE", "boolean");
    const strFalseToBool =       SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("false", "boolean");
    const strFalseLowerToBool =  SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType("FALSE", "boolean");
    const boolTrueToBool =       SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(true, "boolean");
    const boolFalseToBool =      SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(false, "boolean");
    const numLargeTrueToBool =   SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(123423.23, "boolean");
    const numTrueToBool =        SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(1, "boolean");
    const numFalseToBool =       SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(0, "boolean");
    const numFalseNegToBool =    SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$ConvertType(-2234, "boolean");

    expect(strTrueToBool).to.be.true;
    expect(strTrueUpperToBool).to.be.true;
    expect(strFalseToBool).to.be.false;
    expect(strFalseLowerToBool).to.be.false;
    expect(boolTrueToBool).to.be.true;
    expect(boolFalseToBool).to.be.false;
    expect(numLargeTrueToBool).to.be.true;
    expect(numTrueToBool).to.be.true;
    expect(numFalseToBool).to.be.false;
    expect(numFalseNegToBool).to.be.false;

    //console.log("TO BOOL ",{strTrueToBool, strTrueUpperToBool, strFalseToBool, strFalseLowerToBool, boolTrueToBool, boolFalseToBool,  numLargeTrueToBool, numTrueToBool, numFalseToBool, numFalseNegToBool})
  })



})

describe('should run state machine tests SpyneCmsPanelDataPropertyTraits', () => {

  it ('should return false forscontainer-cms properties ',()=>{
    const props = {
      "data" : {
        "cmsKey": "2",
        "cmsVal": {"cat":"meow"},
        "dataCmsId": "cms-51934000-0000000007",
        "dataCmsKey": "2"
      },
      "isContainer" : "true"
    };

    const propsStateMachine = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$CreateStateMatchine(props);
    const containerState = propsStateMachine({"dog" : "bowwow"}).stateChanged;
    expect(containerState).to.be.false;
  })

  it('should return true for new properties with no cmsId or no cmsKey', ()=>{
    const propsNoKey = {
      "data" : {
        "cmsKey": "2",
        "cmsVal": "my string",
        "dataCmsId": "cms-51934000-0000000007",
      }
    };

    const propsNoId = {
      "data" : {
        "cmsKey": "2",
        "cmsVal": "my string",
        "dataCmsKey": "2"
      }
    };


    const propsStateMachineNoKey = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$CreateStateMatchine(propsNoId);


    const propsStateNoKey = propsStateMachineNoKey('my string').stateChanged;
    const propsStateNoId = propsStateMachineNoKey('my string').stateChanged;

    expect(propsStateNoKey).to.be.true;
    expect(propsStateNoId).to.be.true;

  })

  it('should return correct state for properties with different and same strings', ()=>{

    const mainStr = "Nam mutat saperet detracto eu, te ubique utamur aliquando pro. Ut verear probatus sea. Porro sonet euripidis ex est, nisl hendrerit vis cu, pri ei admodum interpretaris. Scripta euismod definitionem an quo. Ad vocent voluptaria sea, ei minim omnesque comprehensam vel.";

    const props = {
      "data" : {
        "cmsKey": "2",
        "cmsVal": mainStr,
        "dataCmsId": "cms-51934000-0000000007",
        "dataCmsKey": "2"
      }
    };

    const propsStateMachine = SpyneCmsPanelDataPropertyTraits.spyneCmsPanelDataProp$CreateStateMatchine(props);


    const defaultState = propsStateMachine().stateChanged;
    const stateChangedTrue = propsStateMachine("new String here").stateChanged;
    const stateChangedReverted = propsStateMachine(mainStr).stateChanged;
    const stateChangedFalse = propsStateMachine(mainStr).stateChanged;

    //console.log({defaultState, stateChangedTrue, stateChangedReverted, stateChangedFalse});

    expect(defaultState).to.be.false;
    expect(stateChangedTrue).to.be.true;
    expect(stateChangedReverted).to.be.true;
    expect(stateChangedFalse).to.be.false;

  })








});
