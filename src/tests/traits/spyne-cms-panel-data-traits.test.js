const {expect, assert} = require('chai');
const {SpyneCmsPanelDataTraits} = require("../../app/internal/traits/spyne-cms-panel-data-traits.js");
const {RootData, OrigData,OrigDataReturned,CmsData, CmsDataPanelEl, ArrayElWithNewPropSimple, ArrayElWithNewPropComplex} = require('../mocks/cms-data-to-dom-items');
const {SpyneCmsPanelDataObjectTraits} = require('../../app/internal/traits/spyne-cms-panel-data-object-traits');
const {SpyneCmsProxyTraits} = require('../../app/internal/traits/spyne-cms-proxy-traits');


const _rootData = {
  "channelName": "CHANNEL_FETCH_PLACEHOLDER_APP_DATA",
  "fileUrl": "http://localhost:8078/public/js/../../static/data/placeholder-app-data.json",
  "fileName": "placeholder-app-data.json",
  "rootProxyId": "cms-35772000-",
  "idMap": new Map(),
  "fileNameClean": "placeholder-app-data"
}



describe('should run SpyneCnsPanelDataTraits tests', () => {

  it('should show SpyneCnsPanelDataTraits exists', () => {
    expect(SpyneCmsPanelDataTraits).to.exist;
  });

});
describe('should run tests for data state machine', ()=>{


  it('should create the data state machine ',()=>{
     const dataStateMachine = SpyneCmsPanelDataTraits.spyneCmsPanelData$CreateDataStateMachine();
     expect(dataStateMachine).to.be.an('Object');
  })

  it('should update the state machine',()=>{
    const dataStateMachine = SpyneCmsPanelDataTraits.spyneCmsPanelData$CreateDataStateMachine();

    const dataHasUpdated =  dataStateMachine.update(true, 'id02');
    const dataHasUpdatedFalse = dataStateMachine.update(false, 'id02');

    expect(dataHasUpdated).to.be.true;
    expect(dataHasUpdatedFalse).to.be.false;
  })

  it('should reset the state machine ',()=>{
    const dataStateMachine = SpyneCmsPanelDataTraits.spyneCmsPanelData$CreateDataStateMachine();
    const dataHasUpdated =  dataStateMachine.update(true, 'id02');
    const dataResetNotUpdated = dataStateMachine.reset();
    expect(dataHasUpdated).to.be.true;
    expect(dataResetNotUpdated).to.be.false;
  })


})


describe('should convert dom element back to original data', ()=>{

  before(function(){

    const body = document.querySelector('body');
    const div = document.createElement('div');
    div.setAttribute('id', 'mock-cms-data-panel');
    div.innerHTML=CmsDataPanelEl;
    body.appendChild(div);
    const divMock = document.querySelector('#mock-cms-data-panel');

  })

  after(function(){
    const divMock = document.querySelector('#mock-cms-data-panel');

    document.body.removeChild(divMock);
  })


  it('should convert data primitive to key value pair', ()=>{

    return true;

  })

  it('should convert array to nested pairs of key, values', ()=>{
    return true;

  })

  it('should convert an object to nested pairs of key values', ()=>{

    return true;

  })

  it('should return cms key',()=>{
    const dataPanelEl = document.querySelector('.cms-data-panel');

    const key = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetCmsItemKey(dataPanelEl)

     expect(key).to.eq('root');
  })


  it('should reduce nested dom element to nested data element', ()=>{
    const dataPanelEl = document.querySelector('.cms-data-panel');
    const dataFromDom = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(dataPanelEl);
    //console.log("DATA FROM DOM ",JSON.stringify(dataFromDom));
    expect(dataFromDom.root).to.deep.eq(OrigDataReturned);

  })

  it('should reduce nested object to data element', ()=>{
    const uiPropsEl = document.querySelector("[data-cms-id='cms-56320000-0000002000']");
    const dataFromDom = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(uiPropsEl);
    const uiPropsData = OrigDataReturned.uiProps;
    //console.log("data is \n",JSON.stringify(uiPropsData));
    expect(dataFromDom.uiProps).to.deep.eq(uiPropsData);

  })

  it('should reduce nested array to data element', ()=>{
    const articleArr= document.querySelector("[data-cms-id='cms-56320000-0000007000']");
    const dataFromDom = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(articleArr);
    const articleArrData = OrigDataReturned.content[0].article;
    //console.log("data is \n",JSON.stringify(dataFromDom));
     expect(dataFromDom.article).to.deep.eq(articleArrData);

  })


  it('should primitive val to data object', ()=>{

    const primitiveValEl = document.querySelector("#eeaimup");

    const key = primitiveValEl.dataset['cmsKey']

    const dataFromDom = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(primitiveValEl);
    const bgKeyVal = OrigDataReturned.content[0].image.background;
    //console.log("data is \n",bgKeyVal);
    expect(dataFromDom.background).to.eq(bgKeyVal);
    return true;

  })


})



describe('should add,delete,move,duplicate data panel items', ()=> {

  before(function() {

    const body = document.querySelector('body');
    const div = document.createElement('div');
    div.setAttribute('id', 'mock-cms-data-panel');
    div.innerHTML = CmsDataPanelEl;
    body.appendChild(div);
    const divMock = document.querySelector('#mock-cms-data-panel');

  })

  after(function() {
    const divMock = document.querySelector('#mock-cms-data-panel');

    document.body.removeChild(divMock);
  })


  it('should get correct key for new object prop ', ()=>{
    const arrEmpty = [];
    const newKeyArr1 = ['appTitle', 'header', 'footer','newKey', '--selected-font', '--selected-palette', 'fontFamilyStr', 'fontFamilyLink', 'paletteColorStr', ]

    const newKeyArr3= ['appTitle', 'header', 'newKey2', 'footer', '--selected-font', '--selected-palette', 'fontFamilyStr', 'fontFamilyLink', 'paletteColorStr', 'newKey', 'newKey1']

    const objKeyEmptyArr = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetKeyForObj(arrEmpty);
    const objKey1 = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetKeyForObj(newKeyArr1);


    const objKey3 = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetKeyForObj(newKeyArr3);

    expect(objKeyEmptyArr).to.eq('newKey');
    expect(objKey1).to.eq('newKey');
    expect(objKey3).to.eq('newKey3');


  });

  it('should create new base data properties ',()=>{

    const primitiveProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetNewPropData();
    const arrayProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetNewPropData('array');
    const objProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetNewPropData('object');

    expect(primitiveProp).to.deep.eq({newKey:''})
    expect(arrayProp).to.deep.eq({newKey:[]})
    expect(objProp).to.deep.eq({newKey:{}})

  })


  it('should create new proxy properties ',()=>{
    const rootData = SpyneCmsProxyTraits.spyneCms$GenerateBaseRootData();

    const primitiveProxyProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$CreateNewProxyProp('primitive', rootData);
    const arrayProxyProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$CreateNewProxyProp('array', rootData);
    const objProxyProp = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$CreateNewProxyProp('object', rootData);
    //console.log('proxy prop is ',primitiveProxyProp, primitiveProxyProp.rootData.idMap.size);
    //console.log('arr prop is ',arrayProxyProp, arrayProxyProp.rootData.idMap.size);
    //console.log('obj prop is ',objProxyProp, objProxyProp.rootData.idMap.size);

    expect(primitiveProxyProp.proxyProperty).to.deep.eq({newKey:''})
    expect(arrayProxyProp.proxyProperty).to.deep.eq({newKey:[]})
    expect(objProxyProp.proxyProperty).to.deep.eq({newKey:{}})

  })




  it('should add a primitive to a panelscontainer-cms object', () => {
    const uiPropsEl = document.querySelector("[data-cms-id='cms-35339000-0000000002']");

   // const primitiveEl = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$InsertNewProp(uiPropsEl);
   // const arrayEl = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$InsertNewProp(uiPropsEl, 'array');
  //  const objectEl = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$InsertNewProp(uiPropsEl, 'object');


    //console.log('panel el is ',uiPropsEl.querySelector(objectEl));


    return true;

  })

});

describe('should update array keys after element manipulation', ()=>{

  before(function(){

    const body = document.querySelector('body');
    const div = document.createElement('div');
    div.setAttribute('id', 'mock-cms-data-panel');
    div.innerHTML= `${ArrayElWithNewPropSimple} ${ArrayElWithNewPropComplex}`;
    body.appendChild(div);
    const arraySimpleEl = document.querySelector('#array-parent-simple');
    const arrayComplexEl = document.querySelector('#array-parent-complex');

  })

  after(function(){
    const divMock = document.querySelector('#mock-cms-data-panel');

    document.body.removeChild(divMock);
  })



  it('should renumber array elements after insertion of complex element', ()=>{
    const articleElSimple  = document.querySelector("#array-parent-simple");
    const articleElComplex = document.querySelector("#array-parent-complex");
     //const arrayEl = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$InsertNewProp(articleArr);

    //console.log('artice arr is ',articleArr);

    const arayItemsElSimple = articleElSimple.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd");
    const arayItemsElComplex = articleElComplex.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd");


    //const arayItemsEl = articleArr.querySelectorAll(":scope > dl > dt .cms-panel-input.type-key");
    //const arayItemsEl = articleElComplex.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd");
    //const arayItemsEl = articleElSimple.querySelectorAll(" dl  dt .cms-panel-input.type-key");
    //const arr = articleElSimple.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd")
   // const arr = arayItemsEl.querySelectorAll("dd")

    //SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$UpdateArrayKeys(arayItemsEl);

    const getLastKey = (arrEls)=>{
      const arr = arrEls.querySelectorAll(":scope > dl > .spyne-cms-property-container > dd");
      const len = arr.length;
      const lastEl = arr[len-1];
      const isContainer = lastEl.dataset['isContainer'] === "true";
      const inputElSelector = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetKeySelector(isContainer);
      const inputEl = lastEl.querySelector(inputElSelector);
      return inputEl.value;
    }

    const getKeys = (el)=>{
      const isContainer = el.dataset['isContainer'] === "true";
      const inputElSelector = SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$GetKeySelector(isContainer);
      const inputEl = el.querySelector(inputElSelector);
     // console.log("KEY1: ",inputEl);
    }

    SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$UpdateArrayKeys(undefined, articleElSimple);
    SpyneCmsPanelDataObjectTraits.spyneCmsPanelDataObj$UpdateArrayKeys(undefined, articleElComplex);
    const lastKeySimple = getLastKey(articleElSimple);
    const lastKeyComplex = getLastKey(articleElComplex);

    expect(lastKeySimple).to.eq("3");
    expect(lastKeyComplex).to.eq("4");
    //console.log("arr is ",arayItemsElSimple.forEach(getKeys), arayItemsElComplex.forEach(getKeys));
    //console.log("ARRAY ITEMS EL",articleArr.querySelectorAll(":scope > dl > dt .cms-key-input"));

    //const dataFromDom = SpyneCmsPanelDataTraits.spyneCmsPanelData$GetDataFromDom(articleArr);
   // const articleArrData = OrigDataReturned.content[0].article;
    //console.log("data is \n",JSON.stringify(dataFromDom));
    //expect(dataFromDom.article).to.deep.eq(articleArrData);

    return true;

  })





})
