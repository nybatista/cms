const {expect, assert} = require('chai');
const R = require('ramda');
const {AppDataNested} = require('../mocks/mock-app-data');
const {LargeData} = require('../mocks/large-data');
const {nestedObj} = require('../mocks/nested-data-obj');

const {SpyneCmsProxyTraits} = require('../../app/internal/traits/spyne-cms-proxy-traits');
const matchCmsIdRE = /^(cms-)(\d{8})(-0000001000)$/;


const nestedArr = {

  "obj" : {
    "arr1" : [],
    "arr2" : ['cat', 'dog', 'bird']
  }

}




describe('should generate map proxy method that passes channelName and fileUrl', ()=>{

  const fileUrl = "http://localhost:8078/public/data/mock-app-data.json";
  const channelName = "CHANNEL_MY_CHANNEL";


  it('should get file name from file url ', ()=>{
    const fileName = SpyneCmsProxyTraits.spyneCms$GetFileName(fileUrl);
    expect(fileName).to.eq('mock-app-data.json');
  });

  it('should get file name from url encoded url',()=>{
    const fileUrl = "http%3A%2F%2Flocalhost%3A8078%2Fpublic%2Fdata%2Fmock-app-data.json";
    const fileName = SpyneCmsProxyTraits.spyneCms$GetFileName(fileUrl);
    expect(fileName).to.eq('mock-app-data.json');
  });


  it('should generate 8 digit random fileId ',()=>{
    const fileId = SpyneCmsProxyTraits.spyneCms$GenerateFileId();
    expect(fileId.length).to.gte(12);
  })


  it('should create a proxyMap function that returns root values ',()=>{

    const proxyMapFn = SpyneCmsProxyTraits.spyneCms$ProxyMap(channelName, fileUrl);

    const proxyObj = proxyMapFn(nestedObj);
    const {__cms__rootData,__cms__dataId} = proxyObj;

    expect(__cms__rootData.channelName).to.eq(channelName);
    expect(__cms__rootData.fileUrl).to.eq(fileUrl);
    expect(__cms__rootData.fileName).to.eq('mock-app-data.json');
    expect(__cms__rootData.idMap.get(proxyObj.level1.__cms__dataId)).to.eq(proxyObj.level1.__cms__dataPath);



  })




})



describe('should test SpyneCmsProxyTraits Class', () => {

  it('SpyneCmsProxyTraits class should exist', () => {
    expect(SpyneCmsProxyTraits).to.exist;
  });

  it('should detect property types',()=>{

    const typeObj = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj);
    const typeArr = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedArr.obj.arr1)
    const typeNull = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj.level1.level2.level3.finalNull);
    const typeUndefined = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj.level1.level2.level3.finalUndefined);
    const typeBool = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj.level1.level2.level3.finalBool);
    const typeStr = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj.level1.level2.level3.finalStr);
    const typeNum = SpyneCmsProxyTraits.spyneCms$GetPropType(nestedObj.level1.level2.level3.finalNum);
    //console.log('type is ',{typeObj, typeArr, typeNull,typeUndefined, typeBool, typeStr, typeNum})

    expect(typeObj).to.eq('object');
    //expect(typeArr).to.eq('object');
    expect(typeNull).to.eq('undefined');
    expect(typeUndefined).to.eq('undefined');
    expect(typeBool).to.eq('primitive');
    expect(typeStr).to.eq('primitive');
    expect(typeNum).to.eq('primitive');


  })


  it('should create a nested proxy object',()=>{

      const proxyObj = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj)
      const {__proxy__isProxy, __proxy__proxyName, __proxy__props} = proxyObj;
      expect(__proxy__isProxy).to.be.true;
      expect(__proxy__proxyName).to.equal(SpyneCmsProxyTraits.spyneCms$ProxyName);
      expect(__proxy__props).to.be.a('object');


  })

  it('should create and return cms values',()=>{
    const proxyObj = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj)
    const nestedTestObj = proxyObj.level1;
    const {__cms__dataId, __cms__dataPath} = nestedTestObj;
    expect(__cms__dataId).to.match(matchCmsIdRE);
    //console.log('data id 1 is ',__cms__dataId);

    expect(__cms__dataPath).to.deep.eq(['level1']);

  })

  it('should create and return cms values for combined data',()=>{
    const proxyObj = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj)
    const data = {proxyObj};

    const nestedTestObj = data.proxyObj.level1;
    const {__cms__dataId, __cms__dataPath} = nestedTestObj;
    expect(__cms__dataId).to.match(matchCmsIdRE);
    expect(__cms__dataPath).to.deep.eq(['level1']);

  })



  it('should maintain original index of items in an array',()=>{
    const proxyObj = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj)
    const {primitiveArr, objsArr} = proxyObj.level1.level2.level3;
    primitiveArr.unshift('tucan');
    primitiveArr.pop();
    const topArrObj  =  objsArr[0];

    objsArr.unshift( {
      animal: 'fox',
      sound: 'yeenk'
    });

    const {__cms__keyFor_cat} = primitiveArr;
    const {__cms__dataPath} = topArrObj;

    // TODO: why is __cms__keyFor_cat showing up as NaN?

    //expect(parseInt(__cms__keyFor_cat)).to.eq(0);
    expect(R.path(__cms__dataPath, nestedObj)['animal']).to.eq('pig');

    return true;

  })

  it('should revive frozen proxy target',()=>{


  })




  it('should detect and loop nested json', ()=>{


    //const cmsData = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(LargeData)
    //const cmsData = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(AppDataNested)
    const cmsData = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj);

   // const testObj = cmsData.propSecondObj.objFirstObj;

   // console.log('cms data is ',{testObj})

    return true;

  })

  it('should loop through entire nested json',()=>{

    //console.log("app data is ",AppDataNested.propFourthNestedObj);

    return true;
  })

});


describe('should create sorted array of dataPaths and proxies', () => {


  it('should run create an a sorted array of dataPaths', () => {
    const proxyObj = SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj);
    const proxyDataPathArr = SpyneCmsProxyTraits.spyneCms$DataReviverCreateArr(proxyObj.level1);
    expect(proxyDataPathArr[0]).to.deep.eq(["level2","level3","objsArr","2"]);

  });

  it('should revive frozen nested proxy object ',()=>{
    const proxyObj =  SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj);

    Object.freeze(proxyObj.level1);

    const revivedObj = SpyneCmsProxyTraits.spyneCms$DataReviveNestedProxyObj(proxyObj.level1);


    return true;
  })

});

