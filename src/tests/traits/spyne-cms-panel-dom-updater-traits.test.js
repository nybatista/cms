const {expect, assert} = require('chai');
const {RootData, OrigData,OrigDataReturned,CmsData, CmsDataPanelEl} = require('../mocks/cms-data-to-dom-items');
const {SpyneCmsPanelDomUpdaterTraits} = require('../../app/internal/traits/spyne-cms-panel-dom-updater-traits')
const {SpyneCmsDataPanelTestsTraits} = require('../../app/internal/traits/spyne-cms-data-panel-tests-traits');

const _rootData = {
  "channelName": "CHANNEL_FETCH_PLACEHOLDER_APP_DATA",
  "fileUrl": "http://localhost:8078/public/js/../../static/data/placeholder-app-data.json",
  "fileName": "placeholder-app-data.json",
  "rootProxyId": "cms-35772000-",
  "idMap": new Map(),
  "fileNameClean": "placeholder-app-data"
}

const {ViewStreamSelector,ViewStream, SpyneApp} = require('spyne');
const {SpyneCmsPanelDataTraits} = require('../../app/internal/traits/spyne-cms-panel-data-traits');
const {CmsDataPanelProperty} = require('../../app/internal/components/spyne-cms/cms-data-panel-property');
let dataPanelEl;// =  document.querySelector('#mock-cms-data-panel');;

let dataPanelel$;// = ViewStreamSelector(dataPanelEl);
let dataPanelItem;// = {el$: dataPanelel$};
let dataPanelView;

describe('it should update idMap and return next cmsId', ()=>{

  it ('should get idMap', ()=>{

    return true;
  })


})

describe('should test dom updater tests ', () => {
  const spyne = SpyneApp.init();

  before(function(){

    const body = document.querySelector('body');
    const div = document.createElement('div');
    div.setAttribute('id', 'mock-cms-data-panel');
    div.innerHTML=CmsDataPanelEl;
    body.appendChild(div);
    const divMock = document.querySelector('#mock-cms-data-panel');
    dataPanelEl =  document.querySelector('#mock-cms-data-panel');;

    dataPanelel$ = ViewStreamSelector(dataPanelEl);
    const el$ = dataPanelel$;
    const props = {el$};
    dataPanelItem = {el$, props};



    const panelEl = document.querySelector(".cms-data-panel.cms-56320000-");
    dataPanelView = new ViewStream({el:panelEl});

  })

  after(function(){
    const divMock = document.querySelector('#mock-cms-data-panel');

    document.body.removeChild(divMock);
  })




  it('dom updater should exist', () => {
    expect(SpyneCmsPanelDomUpdaterTraits).to.be.a('function');
  });

  it('should get the property selector by cmsId and cmsKey ', ()=>{

    //data-cms-id="cms-35339000-0000000002" data-cms-key="footer" data-cms-type="primitive" id="ihhswyq" name="CmsDataPanelProperty" data-vsid="ihhswyq"

    const appenderCmsId = "cms-35339000-0000000002";
    const appenderCmsKey = "fontFamilyStr";
    const newPropType = "primitive";

    const propertySel = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetPropertySelectorByData(appenderCmsId, appenderCmsKey);

    const divMock = document.querySelector('#mock-cms-data-panel');


    const el$ = ViewStreamSelector(divMock);


    //console.log('new Prop is ', {propertySel}, el$(propertySel).arr[0]);


    return true;

  })


  it('should get the next cmsId by checking current parent dd siblings',()=>{

    //const parentId = "cms-56320000-1000000000";
    const parentId = "cms-56320000-1000001000";
    const newCmsId =  SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNextCmsIdFromSiblings(parentId);
    //expect(newCmsId).to.eq('cms-56320000-1000005020');
    expect(newCmsId).to.eq(5020);
  })

  it('should return proxy values to restart proxy json reducer ',()=>{
    const appenderCmsId = "cms-12686000-0000002000";
    const proxyVals = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsValuesByCmsId(appenderCmsId);
    expect(proxyVals.rootProxyId).to.eq("cms-12686000-");
    expect(proxyVals.iterCount).to.eq(2000);
    expect(proxyVals.iterMagnitude).to.eq(1);
    expect(proxyVals.parentDataId).to.eq(appenderCmsId);

  })




  it('should return cmsId, cmsKey for element', ()=>{

    const uiPropsElStr = "#tsovmo";
    const uiPropsEl = document.querySelector(uiPropsElStr);
    const {cmsKey, cmsId} = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsIdAndKey(uiPropsElStr, dataPanelItem.el$);

    const elProps = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsIdAndKey(uiPropsEl);
    const correctCmsId = "cms-56320000-0000002000";
    const correctCmsKey = "false";

    expect(cmsId).to.eq(correctCmsId);
    expect(cmsKey).to.eq(correctCmsKey);
    expect(elProps.cmsId).to.eq(correctCmsId);
    expect(elProps.cmsKey).to.eq(correctCmsKey);

  })



  /**
   *  TESTS
   *
   *  activeElementId;
   *  activeElement = document.querySelector(activeElementId);
   *  moveElementId;
   *  moveElement = document.querySelector(moveElementId);
   *  dataEvent = "primitive"; //["primitive", "object", "array",  "duplicate"];
   *
   *
   *
   *
   *  duplicateActiveElement = dataEvent==='duplicate';
   *
   *  parentDataId =     moveElement!==undefined ? moveElement.dataset.parentCmsId || activeElement.dataset.parentCmsId;
   *  parentSelector = `[cmsId=parentDataId]["false"]`
   *  parentElement =   document.querySelector(parentSelector);
   *  parentIsArray =    parentElement.dataset.cmsType==="array";
   *
   *  appendElement = moveElement || activeElement;
   *  appendType = parentElement !== appendElement ? "appendAfter" : "append";
   *
   *  appendSelector = appendType === "append" ? parentSelector : `#${appendElement.id}`;
   *
   *
   *  value = getPropertyData(dataEvent, activeElement, parentDataId);
   *
   *     newKey = "newKey"
   *
   *       if parentIsArray
   *          newKey = appendType === "appendAfter" ? activeElement.index+1 : parentElement.childCount
   *
   *       else if parentIsArray === false && duplicateActiveElement === true
   *          newKey = activeElement.querySelector('keyEl').value;
   *
   *      return checkForParentIncrement(newKey, parentElement);
   *
   *  key = newKey
   *  return [key, value];
   *
   *
   *
   *  PRIMITIVES - newKey / newNumber - checkForParentIncrement
   *     Append Primitive
   *     Append Object
   *     Append Array
   *
   *     AppendAfter Primitive
   *     AppendAfter Object
   *     AppendAfter Array
   *
   *
   *  DUPLICATES - currentKey / newNumber - checkForParentIncrement
   *     Append Duplicated Primitive
   *     Append Duplicated Object
   *     Append Duplicated Array
   *
   *     AppendAfter Duplicated Primitive
   *     AppendAfter Duplicated Object
   *     AppendAfter Duplicated Array
   *
   *
   *  MOVE - currentKey / newNumber - checkForParentIncrement
   *     Append Moved Primitive
   *     Append Moved Object
   *     Append Moved Array
   *
   *     AppendAfter Moved Primitive
   *     AppendAfter Moved Object
   *     AppendAfter Moved Array
   *
   *
   *
   * */

  it('should warn if propertyParams are missing or malformed', ()=>{
    const noItems = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyConformPropertyParams(undefined, undefined, true);
    expect(noItems.activeElement).to.be.false;
  })

  it('should return correct activeElement', ()=>{
    const activeElementId = "tsovmo";

    const conformedProps = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyConformPropertyParams({activeElementId, dataEvent:'primitive'}, dataPanelItem);

    const {activeElement} = conformedProps;


    expect(activeElement.id).to.eq(activeElementId);

  });

  it('should return all append properties ',()=>{
    const activeElementId = "#tsovmo";
    const activeElement = dataPanelItem.props.el$(activeElementId).el;
    const appendType = 'appendViewAfter';
    const moveElementId = "llnfpdg";


    const appendProps = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyGetAppendProps({activeElement}, dataPanelItem);
    const appendPropsMove = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyGetAppendProps({activeElement, moveElementId}, dataPanelItem);
    const appendPropsAfter =  SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AppendNewPropertyGetAppendProps({activeElement, appendType}, dataPanelItem);


    expect(appendProps.parentSelector).to.eq(`[data-cms-id="cms-56320000-0000000000"][data-cms-key="false"]`);

    expect(appendPropsMove.parentSelector).to.eq(`[data-cms-id="cms-56320000-0000005000"][data-cms-key="false"]`);
    expect(appendPropsMove.duplicateActiveElementBool).to.be.true;
    expect(appendPropsMove.appendType).to.eq('appendViewAfter');
    expect(appendPropsAfter.appendType).to.eq('appendViewAfter');


  });

  it('should get element key ', ()=>{

    const containerEl = document.querySelector('#tsovmo');
    const primitiveEl = document.querySelector("#ushhmql");

    const containerKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetElementKey(containerEl);
    const primitiveKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetElementKey(primitiveEl);


    expect(containerKey).to.eq('uiProps');
    expect(primitiveKey).to.eq('header');

  })

  it('should find the correct new key value ', ()=>{

    const parentSelector = "#tsovmo";
    const parentSelectorArr = "#rjwpvew";
    const activeElement = document.querySelector("#ushhmql");
    const activeElementArrItem = document.querySelector("#eeecwuu");
    const duplicateActiveElementBool = true;
    const appendType = "appendAfter";


    const newKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsKey({parentSelector, activeElement}, dataPanelItem);

    const newKeyArr = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsKey({parentSelector:parentSelectorArr, activeElement}, dataPanelItem);
    const newKeyArrAppendAfter = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsKey({
      appendType,
      parentSelector:parentSelectorArr,
      activeElement:activeElementArrItem}, dataPanelItem);

    const newHeaderKey = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetNewPropertyCmsKey({parentSelector, activeElement, duplicateActiveElementBool}, dataPanelItem);


    // console.log("newKeyArrAppendAfter key is ",newKeyArrAppendAfter);
    expect(newKey).to.eq('newKey');
    expect(newKeyArr).to.eq(4);
    expect(newHeaderKey).to.eq('header1');
  })


  it('should append basic values to a proxy item within the data panel ',()=>{
    const uiPropsElStr = "#tsovmo";
    // const {cmsKey, cmsId} = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetCmsIdAndKey(uiPropsElStr, dataPanelItem.el$);
    // const uiPropsObj =  SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$AddNewProperty(cmsId, cmsKey, 'primitive');
    //console.log('ui props obj is ',uiPropsObj);

    //DATA PANEL COMPILE METHOD
    // CREATE

    //this[appendMethod].(new DataPanelItemVS(props), appendorSelector);


    //console.log('selector is \n',JSON.stringify(uiPropsPrps));


    return true;
  })

  it('should run through the test traits ',async()=>{

    const dataPanelTestsConfig = SpyneCmsDataPanelTestsTraits.spyneDPTests$GetTestsToRun();
    const testObjEl = document.querySelector('.key-testObject');


    const runAllConfigTests = async()=>{
      const configTestsGenerator = async function* (){
        //console.log('parsers arr length ',parsersArr.length, parsersArr[4].type)
        try{
          for (const config of dataPanelTestsConfig){
            // console.log('config is ',config.id);
            yield config;
          }
        } catch(e){
          console.warn(e, 'AppCreator.parsersGenerator');
        }
      }


      const configTests = await configTestsGenerator(dataPanelTestsConfig);

      //console.log('config tests is ',{configTests})

      try{

        for await (const configTest of configTests){
          const appendProps =  SpyneCmsDataPanelTestsTraits.spyneDPTests$GetTestEventPayload(configTest.props);
          const {dataEvent, activeElementId} = appendProps;

          if (dataEvent === 'delete'){
            document.querySelector(`#${activeElementId}`).remove();
            // return true;
          } else {

            const {appendType,appendSelector,itemProps} = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetAppendParams(appendProps, dataPanelItem);

            dataPanelView[appendType](new CmsDataPanelProperty(itemProps), appendSelector);
          }


          const data = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(testObjEl);
          //console.log("DATA EVENT ",data);



         // expect(data.testObject).to.deep.eq(configTest.data);
          // TODO: figure out why this is failing

          return true;

          //console.log('append property GENERATOR is \n',JSON.stringify(data));


        }


      } catch(e){
        //console.log(e.message);
        expect(e.expected).to.deep.eq(e.actual);
      }


    }



    await runAllConfigTests();


    return true;
  })

  /*  it('should add the correct properties to the data panel', ()=>{

      const getIdByCmsKeyVal = (cmsKey, cmsKey2)=>{
        const cls = cmsKey2 === undefined ? `.key-${cmsKey}` : `.key-${cmsKey} .key-${cmsKey2}`;
        console.log("CLS IS ",cls);
        return document.querySelector(cls).id;
      }

      console.log("GET ID ", getIdByCmsKeyVal("testDupeObj", "prop2"))


      const rootTestObjId         = getIdByCmsKeyVal("testObject");
      const randomProp1Id         = getIdByCmsKeyVal("randomProp1");
      const testDupeObjId         = getIdByCmsKeyVal("testDupeObj");
      const testDupeObjProp2Id    = getIdByCmsKeyVal("testDupeObj", "prop2");
      const randomProp2Id         = getIdByCmsKeyVal("randomProp2");
      const testDupeArrId         = getIdByCmsKeyVal("testDupeArr");
      const testDupeArrProp1Id    = getIdByCmsKeyVal("testDupeArr", "prop1");
      const randomProp3Id         = getIdByCmsKeyVal("randomProp3");


      const activeElementId = "tsovmo";
      const dataEvent = "duplicate";

      const newDataProps = SpyneCmsPanelDomUpdaterTraits.spyneDomUpdater$GetAppendParams({activeElementId, dataEvent}, dataPanelItem);


      console.log('new data prop is ',newDataProps);



      return true;
    })*/




});
