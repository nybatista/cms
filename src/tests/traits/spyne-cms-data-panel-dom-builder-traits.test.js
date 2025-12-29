const {expect, assert} = require('chai');
const {nestedObj, nestedObjExtended} = require('../mocks/nested-data-obj');


const {SpyneCmsDataPanelDomBuilderTraits} = require("../../app/internal/traits/spyne-cms-data-panel-dom-builder-traits");
const {SpyneCmsProxyTraits} = require('../../app/internal/traits/spyne-cms-proxy-traits');
describe('should test data panel dom builder traits', () => {
  const url = "http://localhost:8078/public/data/mock-app-data.json";
  const channelName = "CHANNEL_MY_CHANNEL";
  const proxyObj =  SpyneCmsProxyTraits.spyneCms$MapData(nestedObjExtended, {channelName, url});


  it('should return that dom builder exists', () => {

    expect(SpyneCmsDataPanelDomBuilderTraits).to.be.a('function');

  });

  it('should create nested proxy object',()=>{

    expect(proxyObj.__proxy__isProxy).to.be.true;

  });

  it('should sort idMap Arr by nesting length',()=>{

    const arr = Array.from(proxyObj.__cms__rootData.idMap);
    const arrSorted = SpyneCmsDataPanelDomBuilderTraits.spyneCMSDomBuilder$SortIdMapByLength(arr);

    const firstMostNestedArrPair = arrSorted[0];
    const firstMostNestedArrPairLen = firstMostNestedArrPair[1].length;

    expect(firstMostNestedArrPairLen).to.eq(7);

  });


  it('should return proxy data obj from idMap Arr ', ()=>{
    const arr = Array.from(proxyObj.__cms__rootData.idMap);
    const arrSorted = SpyneCmsDataPanelDomBuilderTraits.spyneCMSDomBuilder$SortIdMapByLength(arr);

    const data = SpyneCmsDataPanelDomBuilderTraits.spyneCMSDomBuilder$GetDataIdMapArr(arrSorted[0], proxyObj);

    expect(data).to.deep.eq(['one', 'two', 'three']);

  })

  it('should create a string organizer object', ()=>{

    const strOrganizer = SpyneCmsDataPanelDomBuilderTraits.spyneCMSDomBuilder$CreateStringOrganizer();

    const strMatch = "hola mundo";

    strOrganizer.set('myStr', strMatch);

    const myStr1 = strOrganizer.get('myStr');
    const myStr2 = strOrganizer.get('myStr');

    expect(myStr1).to.eq(strMatch);
    expect(myStr2).to.be.undefined;


  })

});
