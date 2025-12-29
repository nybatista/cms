const dataObj = require('../static/data/proxy-test-data.json');
const R = require('ramda');


const handler = (target, name, receiver)=>{



}





const handler2 = {
  ubu(target, key, receiver){

      return get(target, key, receiver);
  },
  guid (){
    return "SDFSDFDS";
  },

  get(target, key, receiver) {
    //console.log('prop2 is ',key);


    const prop = target[key];
   // acc+=`.${prop}`;


    if (typeof(prop)==='object') {
      target[key] = new Proxy(prop, handler2);
      //acc+=`.${key}`;
      //console.log("ACC IS ", key);

      return target[key];
    } else {
      console.log("RETURNING EMPTY ",{key,prop,target});
      return target;
    }
    //return target[prop];
  }
};


const handler3 = {

  ownKeys(o, name) {

    //console.log("HAS own TRAP ",name);
    return true;


  },

  has(o, name) {

    //console.log("HAS TRAP ",name);
    return true;


  },

  guid (){
    return "SDFSDFDS";
  },

  get(target, prop, receiver) {
    //console.log('prop3b is ',prop);

    if (prop === "message2") {
      return "world";
    }
    return Reflect.get(...arguments);
  },
};

const handler4 = {

  has(o, name) {

      //console.log("HAS TRAP ",name);
      return true;


    },
  guid (acc){
    //console.log("GUID IS asdfadsfa",acc);
    return "SDFSDFDS";
  },

  get(target, key) {
    let acc =  target.acc || '';

    //console.log("acc is ready1? ",acc, {key})

    if (key===undefined){
      console.log("UNDEFINED ",target, key);
      return;
    }


    if (key === 'isProxy')
      return true;

    const prop = target[key];
    //console.log("prop is ",key);
    // return if property not found
    if (typeof prop == 'undefined')
      return;

    // set value as proxy if object

    if (typeof prop === 'object'){
      prop.acc = acc;

    target[key] = new Proxy(prop, handler4);
    prop.acc+=`.${key}`;
    //console.log("ACC IS ",prop.acc);

    return target[key];

    } else if (prop!==undefined){
      console.log('not undefined ',acc,key, target[key], target.acc)
      prop.guid = acc;
      return target[key];

    } else {
      prop.acc+=`.${key}`;
      //console.log("GUID MODE ",target.acc);
      return target.acc
    }
  },
  set(target, key, value) {
    //console.log('Setting', target, `.${key} to equal`, value);

    // todo : call callback

    target[key] = value;
    return true;
  }
};


const dataProxy = new Proxy(dataObj, handler4);
//cms.log('image: ',dataProxy['image'].src.original);

//cms.log('guid: ',dataProxy['image'].src.original.acc);
//console.log("ORIG DATA IS ",R.path(['image','src','original'], dataObj));
