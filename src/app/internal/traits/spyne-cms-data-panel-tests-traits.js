import {SpyneTrait, SpyneAppProperties} from 'spyne';
import {DataPanelTestsConfig, DataPanelTestsConfigClass} from './utils/data-panel-tests-config';
import {expect} from 'chai';
const _panelsTestMode = true;
let _panelTestsConfigArr
let _tesObjSel = 'testObject';
let _testObjEl;

export class SpyneCmsDataPanelTestsTraits extends SpyneTrait {

  constructor(context){
    let traitPrefix = "spyneDPTests$";

    super(context, traitPrefix);
  }

  static spyneDPTests$CheckTestMode(props=this.props){
    if (_panelsTestMode === true && props.el$(`.key-${_tesObjSel}`).exists === true){
      _testObjEl =  props.el$(`.key-${_tesObjSel}`).el;
      this.spyneDPTests$RunTests();
    }

  }

  static spyneDPTests$CheckTestItem(payload, props=this.props){
    const {testId,testData} = payload;
    const data = this.spyneCmsPanelData$GetDataFromDom(_testObjEl);

    if(SpyneAppProperties.getProp('disableAssertion')===true){
      return true;
    }

    try {
      expect(data.testObject).to.deep.eq(testData);
      expect(Reflect.ownKeys(data.testObject)).to.deep.eq(Reflect.ownKeys(testData));
      const action = "CHANNEL_DATA_PANELS_TEST_PASSED_EVENT_REQUEST";
      //console.log("CONFIG CHECKER TEST PASSED ",Reflect.ownKeys(testData));
      const {rootProxyId} = this.props.rootData;
      this.spyneDPTests$SendChannelDataPanelEvent({testId, rootProxyId}, action);

    } catch(e){
      console.log("CONFIG TEST ERROR ",e, {data,testData}, data.testObject);
    }

  }


  static spyneDPTests$OnTestPassed(e){
      const {payload} = e;
      const {dataEvent} = payload;
      //console.log("TEST HAS PASSED ",{dataEvent, payload});
      this.spyneDPTests$StartTestEvent();

  }

  static spyneDPTests$GetIdByCmsKeyVal(cmsKeys){
    if (typeof(cmsKeys)!=='string'){
      return undefined;
    }

    const addKeysReducer = (acc, str, i) =>{
      const parentSel = " > dl > .spyne-cms-property-container > ";
      const cls =  i === 0 ? `.key-${str} ` : `${parentSel} .key-${str} `
      acc+=cls;
      return acc;
    }

    const keysArr = cmsKeys.split(' ');
    const keysClass = keysArr.reduce(addKeysReducer, '');
    //console.log('key class is ',{cmsKeys, keysArr, keysClass})

    return document.querySelector(keysClass).id;

  }

  static spyneDPTests$SendChannelDataPanelEvent(payload, action="CHANNEL_DATA_PANELS_APPEND_PROPERTY_REQUEST"){
    const channelName = "CHANNEL_DATA_PANELS";
    this.sendInfoToChannel(channelName, payload, action);

    //console.log('payload items ', {action, payload})

  }

  static spyneDPTests$PrepareTestEvent(appendProps, testId, testData){
    //console.log('append props: ',{appendProps},appendProps[0], appendProps[2]);

    const {dataEvent, activeElementId, appendType, moveElementId} = this.spyneDPTests$GetTestEventPayload(appendProps);

    const action = dataEvent === 'delete' ? "CHANNEL_DATA_PANELS_DELETE_PROPERTY" : "CHANNEL_DATA_PANELS_APPEND_PROPERTY"

    const {rootProxyId} = this.props.rootData;

    //console.log({activeElementId, moveElementId,activeElementSel, appendType, dataEvent, moveElementSel})
    const isTestEvent = true;

    this.spyneDPTests$SendChannelDataPanelEvent( {dataEvent,isTestEvent,testId, testData,action,rootProxyId, activeElementId, appendType, moveElementId})

  }

  static spyneDPTests$GetTestEventPayload(appendProps){
    const [dataEvent, activeElementSel, appendType, moveElementSel] = appendProps;
    const activeElementId = SpyneCmsDataPanelTestsTraits.spyneDPTests$GetIdByCmsKeyVal(activeElementSel);
    const moveElementId = SpyneCmsDataPanelTestsTraits.spyneDPTests$GetIdByCmsKeyVal(moveElementSel);
    if (dataEvent==='delete'){
      const onFrame = ()=>{
        //console.log("SEND DELETE");
        //this.spyneDPTests$StartTestEvent();
      }
     // window.setTimeout(onFrame, 1000);
     // requestAnimationFrame(onFrame);
    }
    return {dataEvent, activeElementId, appendType, moveElementId}
  }

  static spyneDPTests$StartTestEvent(sendNext=false){
    //console.log("LEN: ",_panelTestsConfigArr);

    if (_panelTestsConfigArr.length>0) {
      const runEvent = () => {
        const testObj = _panelTestsConfigArr.shift();

        this.spyneDPTests$PrepareTestEvent(testObj.props, testObj.id, testObj.data);
      }

      if (sendNext === true) {
        window.setTimeout(runEvent, 2250);
      } else {
        runEvent();
      }

    }
  }

  static spyneDPTests$RunTests(props=this.props){
    const tests = ["dupeTestObj"];

    //const config = SpyneCmsDataPanelTestsTraits.spyneDPTests$GetTestsConfig();
    //console.log('test config is ',config);
    //this.spyneDPTests$PrepareTestEvent(config[0].props)
    //const config = this.spyneDPTests$GetTestsToRun(tests);
    _panelTestsConfigArr  = this.spyneDPTests$GetTestsToRun(tests);
    //console.log("PANELS TEST ",{_panelTestsConfigArr, tests})
    //console.log('configs is ',config);

    const onSendEvent = (o)=>{
     // console.log("O IS ",{o})
      this.spyneDPTests$PrepareTestEvent(o.props, o.id, o.data);
    }

    //config.forEach(onSendEvent);
    this.spyneDPTests$StartTestEvent();



  }

  static spyneDPTests$GetTestsToRun(testIdsArr){
    const testsArr = SpyneCmsDataPanelTestsTraits.spyneDPTests$GetTestsConfig(testIdsArr);
    if (testIdsArr === undefined){
      return testsArr;
    }
    const testIdsFilter = (o)=>testIdsArr.includes(o.id);
    //return testsArr.filter(testIdsFilter);

    //console.log("RETURNED TESS ",{testsArr, testIdsArr})
    return testsArr;
  }

  static spyneDPTests$GetTestsConfig() {

    return  DataPanelTestsConfigClass.getTest();




  }












  static spyneDPTests$HelloWorld(){
    return "Hello World";
  }

}

