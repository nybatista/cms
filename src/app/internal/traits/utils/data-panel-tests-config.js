import {SpyneAppProperties} from 'spyne';
import {assocPath} from 'ramda';
const {prop,clone, props, propEq, findIndex, filter, compose, reject, forEachObjIndexed, mapObjIndexed, path, set, over,values, lens,view, lensProp,lensIndex, lensPath} = require('ramda');

const _panelTestsConfig = [];
const _testObject = {
  "randomProp1": "random prop one",
  "testDupeObj": {
    "prop1": "property number one",
    "prop2": "property number two",
    "prop3": "property number three"
  },
  "randomProp2": [
    "random prop two"
  ],
  "testDupeArr": [
    "property number one",
    "property number two",
    "property number three"
  ],
  "randomProp3": {}
}


// ================ DATA METHODS ==========
const setPath = (pathArr, str, testObj=_testObject) => assocPath(pathArr, str, clone(testObj))

const setPaths = (allPathsArr, dataObj = orig()) =>{

  const pathsReducer = (acc, pathsInfo) =>{


    const [pathsArr, str] = pathsInfo;

    acc = setPath(pathsArr, str, acc);

    //console.log("ACC IS ",clone(acc), {pathsArr, str});

    return acc;
  }

  //console.log("PATHS ARR ",allPathsArr);

  return allPathsArr.reduce(pathsReducer, dataObj)

}
// ================ END DATA METHODS ==========

const orig = ()=>clone(_testObject);
const getArrLen = (arrPath)=>view(lensPath(arrPath), _testObject).length;

const addTo = (o, propStr)=>set(lensProp(propStr), o, _testObject);
const dupeFn = (dupeProp)=>prop(dupeProp, _testObject)
const dupeFnObj = (dupeProp)=>({[dupeProp]:_testObject[dupeProp]})

const dupe =   (dupeProp, propStr)=>addTo(dupeFn(dupeProp), propStr);
const moveTo = (o, propStr, pathArr)=>set(lensPath(pathArr.concat(propStr)), o, _testObject);
const dupeMoveTo = (dupeProp, propStr, moveArr) => moveTo(dupeFn(dupeProp), propStr, moveArr);
const dupeMoveToArr = (dupeProp, propStr, moveArr, index=getArrLen(moveArr)) =>  set(lensPath(moveArr.concat(index)),  dupeFnObj(dupeProp), _testObject)
const dupeAfter=(dupeProp, propStr, movePath)=>{
  const newProp = prop(dupeProp, _testObject);
  const obj = clone(_testObject);
  const obj2 = {};
  const mapPropInto = (val, key)=>{
    obj2[key] = val;
    if (key===dupeProp){
      obj2[propStr] = newProp;
    }
  }
    forEachObjIndexed(mapPropInto, obj);
    return obj2;
}


const dupeAndSetPaths = (dupeProp, propStr, allPathsArr)=>{
  const obj = dupe(dupeProp, propStr);

  return setPaths(allPathsArr, obj);

}



const testVal = dupeAfter('testDupeObj', "testDupeObj1");
//const testVal = dupeMoveToArr('testDupeObj', 'testDupeObj1', ['testDupeArr'])



class DataPanelTestsConfigClass {


  constructor(startConfigItem, endConfigItem=1) {
    return DataPanelTestsConfig.slice(0,1);
/*    if (startConfigItem === undefined){
      return DataPanelTestsConfig;
    }*/


  }




  static getTest(testName){
    //testName="addArrIntoAndDelete";
   // testName = "moveDupeTestObjAndBack";
      //testName = "moveDupeTestObj";
   // testName = "moveArrPropToDupe";

    //testName = "addObjIntoAndDelete";

   // SpyneAppProperties.setProp('disableAssertion', testName!==undefined);


    const testConfigdata = clone(DataPanelTestsConfig);
    const getIndex = str => compose(findIndex(propEq('id',str)))(testConfigdata);
    const getSlice = (str, amt=1)=>{
      const n = getIndex(str);
      //console.log("N INDEX DATA ",{n, str, amt});
      return testConfigdata.slice(n, n+amt);
    }

    const testsHash = {
      "dupeObj" :  testConfigdata.slice(getIndex('dupeTestObj'), 1),
      "dupeAndDelete" : testConfigdata.slice(getIndex('dupeTestObj'), 2),
      "addObjectInto" : getSlice('addNewObjectInto'),
      "addObjectIntoAndAddKey" : getSlice('addNewObjectInto', 2),
      "addObjIntoAndDelete" : getSlice('addNewObjectInto', 3),
      "addArrayInto" : getSlice('addNewArrayInto'),
      "addArrayIntoAndAddKey" : getSlice('addNewArrayInto', 2),
      "addArrIntoAndDelete" : getSlice('addNewArrayInto', 3),
      'moveDupeTestObj':      getSlice("moveDupeTestObj", 1),
      'moveDupeTestObjAndBack':      getSlice("moveDupeTestObj", 2),
      'moveArrPropToDupe':      getSlice("moveArrPropToDupe", 1)
    }

    const testObj = clone(testsHash[testName]);
   // const testIndex = getIndex(testName);

    //console.log("TEST HASH ",clone(testObj),testName, {testConfigdata})

    return clone(testObj) || testConfigdata;

  }


}





const DataPanelTestsConfig = [
  {
    id: "moveDupeTestObjBacked",
    props: ['duplicate', 'testDupeObj', 'appendViewAfter', 'randomProp1'],
    data: dupe('testDupeObj', 'testDupeObj1')
  }
]


const DataPanelTestsConfig1 = [

  {
    id: "dupeTestObj",
    props: ['duplicate', 'testDupeObj', 'appendView',  undefined],
    dataOld: {"randomProp1":"random prop one","testDupeObj":{"prop1":"property number one","prop2":"property number two","prop3":"property number three"},"randomProp2":["random prop two"],"testDupeArr":["property number one","property number two","property number three"],"randomProp3":{},"testDupeObj1":{"prop1":"property number one","prop2":"property number two","prop3":"property number three"}},
    data: dupe('testDupeObj', 'testDupeObj1')
  },
  {
    id: "dupeTestObjPrimitive",
    props: ['primitive', 'testDupeObj1', 'appendInto'],
    data: dupeAndSetPaths('testDupeObj', 'testDupeObj1', [[['testDupeObj1', 'newKey'], 'value']])

  },
  {
    id: "dupeTestObjDelete",
    props: ['delete', 'testDupeObj1'],
    data: {"randomProp1":"random prop one","testDupeObj":{"prop1":"property number one","prop2":"property number two","prop3":"property number three"},"randomProp2":["random prop two"],"testDupeArr":["property number one","property number two","property number three"],"randomProp3":{}}

  },
  {
    id: "addNewObjectInto",
    props: ['object', 'testDupeObj', 'appendInto'],
    data: setPath(['testDupeObj', 'newKey'], {}),
  },
  {
    id: "adKeyIntoNewObj",
    props: ['primitive', 'testDupeObj newKey', 'appendInto'],
    data: setPath(['testDupeObj', 'newKey', 'newKey'], "value"),
  },
  {
    id: "deleteNewObjectInto",
    props: ['delete', 'testDupeObj newKey'],
    data: orig()
  },  {
    id: "addNewArrayInto",
    props: ['array', 'testDupeObj', 'appendInto'],
    data: setPath(['testDupeObj', 'newKey'], []),
  },
  {
    id: "adKeyIntoNewArr",
    props: ['primitive', 'testDupeObj newKey', 'appendInto'],
    data: setPaths([[['testDupeObj', 'newKey'], []], [['testDupeObj', 'newKey', 0], 'value']]),
    data3: setPath(['testDupeObj', 'newKey', 0], "value"),
  },
  {
    id: "deleteNewArrInto",
    props: ['delete', 'testDupeObj newKey'],
    data: orig()
  },

  {
    id: "moveDupeTestObj",
    props: ['duplicate', 'testDupeObj', 'appendViewAfter', 'randomProp3'],
    data: orig()
  },   {
    id: "moveDupeTestObjBacked",
    props: ['duplicate', 'testDupeObj1', 'appendViewAfter', 'randomProp1'],
    data: orig()
  },{
    id: "moveBackDupeTestObj",
    props: ['delete', 'testDupeObj'],
    data: orig()
  },

  {
    id: "moveArrPropToDupe",
    props: ['duplicate', 'testDupeArr', 'appendViewAfter', 'randomProp3'],
    data: orig()
  }






]


  export{DataPanelTestsConfig, DataPanelTestsConfigClass}

