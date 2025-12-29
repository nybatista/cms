const {expect, assert} = require('chai');
const {MoveStateMachines} = require('../../app/internal/traits/utils/move-state-machines')

describe('should test move state machine', () => {
 const _moveStateMachine = new MoveStateMachines();

  it('should create a state machine', () => {

    expect(_moveStateMachine).to.exist;
  });

  it('should initialize a new move state machine checker ', ()=>{
    const incStateNum = _moveStateMachine.createMoveStateMachine();
    const stateNum = _moveStateMachine.createMoveStateMachine();

    const stateMoved = _moveStateMachine.updateMoveState(stateNum, 'moved');
    const stateMovedCompleted = stateMoved.completed;
    const isDeleteReadyTrue = stateMoved.isDeleteReady;

    const stateDeleted = _moveStateMachine.updateMoveState(stateNum, 'deleted');
    const isDeleteReadyFalse = stateDeleted.isDeleteReady;
    const stateDeletedCompleted = stateDeleted.completed;


    expect(incStateNum).to.eq(0);
    expect(stateNum).to.eq(1);
    expect(stateMovedCompleted).to.be.false;
    expect(isDeleteReadyTrue).to.be.true;
    expect(stateDeletedCompleted).to.be.true;
    expect(isDeleteReadyFalse).to.be.false;
    return true;
  })


});
