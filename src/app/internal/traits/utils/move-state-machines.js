const {compose, all, equals, values} = require('ramda');
const _stateObjsArr = [];

export class MoveStateMachines {


  constructor() {


  }


  createMoveStateMachine(){
    _stateObjsArr.push(MoveStateMachines.getDefaultState())
    return  _stateObjsArr.length-1;
  }




   updateMoveState(stateNum, str){
    if (stateNum === undefined || str === undefined){
      console.warn("state values not added ", {stateNum, str});
      return false;
    }

    const stateObj = _stateObjsArr[stateNum];

    if (stateObj[str]===true){
      console.warn('this state has already been called ',{stateNum, str, stateObj});
    } else if (stateObj[str] !== undefined){
      stateObj[str] = true;
    }
    const completed = compose(all(equals(true)), values)(stateObj);
    const isDeleteReady = stateObj.deleted === false && stateObj.moved === true;

    return {stateObj, completed, isDeleteReady};

  }


  static getDefaultState(){
    return {
      "moved" : false,
      "deleted" : false
    }
  }






}
