const {expect, assert} = require('chai');
const R = require('ramda');
const {AppDataNested} = require('./mocks/mock-app-data');
const {LargeData} = require('./mocks/large-data');
const {DomElementTemplate} = require('spyne');

const {SpyneCmsProxyTraits} = require('../app/internal/traits/spyne-cms-proxy-traits');
const cmsTmpl = require('./mocks/cms-data.tmpl.html');
const {toPairs} = require('ramda');

const finalNull = null;
const finalUndefined = undefined;

const nestedObj = {
  "level1" : {
    "level2" : {
      "title" : "Template Title",
      finalStr: "myString",
      finalBool: true,
      "arr2" : ['pig', 'cow', 'chicken'],
      "anotherArr" : [
        {color: 'orange', mood :'fun'},
        {color: 'white', mood: 'clean'},
        {color: 'black', mood: 'deep'}

      ],

      "level3" : {
        "title__cms__dataTags" : " data-cms-id='341234' data-cms-key='template-title' ",
        "title" : "Template Title",

        "level4" :  {
          "title" : "FOURTH TITLE"
        },
        finalNull,
        finalUndefined,
        finalBool: true,
        finalStr: "Third Level String",
        finalNum: 33322,
        finalArr: [],
        "arr2" : ['cat', 'dog', 'bird'],
        "anotherArr" : [
          {color: 'red', mood :'intense'},
          {color: 'blue', mood: 'calm'},
          {color: 'green', mood: 'trust'}

        ]
      }
    }
  },
  level1a: {
    myVal: 'yayaya'
  }
}


const nestedArr = {

  "obj" : {
    "arr1" : [],
    "arr2" : ['cat', 'dog', 'bird']
  }

}

const template1 =  `<div class="generic template">
    <h1>The title is {{title}}</h1>
    <div data-is-final="{{finalBool}}"   ></div>
    {{#arr2}}
    <h3>animal: {{.}}</h3>
    {{/arr2}}
    <h3>{{level3.finalStr}}</h3>
</div>
`



describe('should test cms data integration with templates', () => {


  it('DomElementTemplate  renders object and loops arrays', ()=>{
    let data =[
      {name: 'jane', hobbies: ['photography','driving','running'], favFoods: ['hummus', 'quinoa', 'burritos']},
      {name: 'joe',  hobbies: []},
      {name: 'john', hobbies: ['vlogging','dancing'] }
    ];
    let template = "<ul><li>Welcome, {{name}}. Your hobbies are {{#hobbies}}{{.}}, {{/hobbies}}and favorite foods are {{#favFoods}}<span>{{.}}, </span>{{/favFoods}} </li></ul>";
    data = data[0];
    let domElTemplate = new DomElementTemplate(template, data);
    let render = domElTemplate.renderDocFrag();
    let favFoodInnerText = render.firstElementChild.querySelectorAll('span')[0].innerText

    /**
     *
     *
     * 'text is ', <ul><li>Welcome, jane. Your hobbies are photography, driving, running, and favorite foods are <span>hummus, </span><span>quinoa, </span><span>burritos, </span> </li></ul>
     *
     *
     * */

    //console.log("favFoodInnerText ",render);
     expect(favFoodInnerText).to.equal('hummus, ');

  });


  it('should replace array object cms item tags with correct values ',()=>{




    return true;

  })



  it('should render cms data with generic template', () => {

    let nestedCmsData =  SpyneCmsProxyTraits.spyneCms$ProxifyJsonData(nestedObj);



       //console.log("nested data is ",nestedCmsData.level1.level2.arr2);

       nestedCmsData.level1.level2.arr2.unshift('elephant');

       const tmplData  = Object.freeze(nestedCmsData.level1.level2);

       const htmlRendered = new DomElementTemplate(cmsTmpl, tmplData);
      // console.log("htmlRendered1 is ",htmlRendered.renderToString());
      // console.log('htmlRendered arr is ',nestedCmsData.level1.level2.level3.arr2,nestedCmsData.level1.level2.level3.arr2['$key_dog'])

      //console.log("NEST ",JSON.stringify(tmplData));

       const getPath = (o)=>console.log('path: ',o.__cms__dataId,': ',o.__cms__dataPath);

/*       getPath(nestedCmsData);
       getPath(nestedCmsData.level1);
       getPath(nestedCmsData.level1.level2);
       getPath(nestedCmsData.level1.level2.arr2);
       getPath(nestedCmsData.level1.level2.level3.arr2);
       getPath(nestedCmsData.level1.level2.anotherArr);
       getPath(nestedCmsData.level1.level2.anotherArr[0]);
       getPath(nestedCmsData.level1.level2.level3);
       getPath(nestedCmsData.level1.level2.level3.level4);
       getPath(nestedCmsData.level1a);*/


    const deepCopyFunction = (inObject) => {
      let outObject, value, key

      if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
      }

      // Create an array or object to hold the values
      outObject = Array.isArray(inObject) ? [] : {}

      for (key in inObject) {
        value = inObject[key]

        //console.log("VALUE IS PROXY ",{value}, value.__cms__isProxy);

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyFunction(value)
      }

      return outObject
    }



       const createNestedArr = (obj)=>{


         reduceNestedArr = (acc, o) =>{

           const [k,v] = toPairs(o);


           if (typeof v === 'object'){

             if (Array.isArray(v) === false){
               v = toPairs(v);
             }
             //console.log("K V IS ",{k,v})

             v.reduce(reduceNestedArr(acc));
           } else {
             acc[k]=v;
           }

           return acc;

         }

         const arr = toPairs(obj);

         return arr.reduce(reduceNestedArr, []);

       }



     //  const clonedObj = deepCopyFunction(nestedCmsData)

   // console.log("nested arr is ",clonedObj.level1.level2.__cms__isProxy)


    return true;
  });

});
