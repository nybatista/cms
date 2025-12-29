const {expect, assert} = require('chai');
const {CmsSelectItemBoxTraits} = require('../../app/internal/traits/cms-select-item-box.traits');
const {CmsDataPanelEl} = require('../mocks/cms-data-to-dom-items');
const {ViewStreamSelector, ViewStream} = require('../../../../spyne');

describe('should test cms select item box traits', () => {
  let dataPanelEl;// =  document.querySelector('#mock-cms-data-panel');;

  let dataPanelel$;// = ViewStreamSelector(dataPanelEl);
  let dataPanelItem;// = {el$: dataPanelel$};
  let dataPanelView;


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



  it('should show that select item box traits exists ', () => {

    expect(CmsSelectItemBoxTraits).to.exist;

  });

  it('should test active element state checker ', ()=>{

    const stateChecker = CmsSelectItemBoxTraits.cmsSelectItem$createActiveStateChecker();

    const isActiveFalseNoIds = stateChecker({activeElement:dataPanelEl});

    const isNowActive = stateChecker({cmsId: 1, cmsKey:'test', activeElement:dataPanelEl})
    const isNotUpdated = stateChecker({cmsId: 1, cmsKey:'test', activeElement:dataPanelEl});
    const isBlur = stateChecker();

    expect(isActiveFalseNoIds.isActiveBool).to.be.false;
    expect(isActiveFalseNoIds.activeElementUpdatedBool).to.be.true;
    expect(isNowActive.isActiveBool).to.be.true;
    expect(isNowActive.activeElementUpdatedBool).to.be.true;
    expect(isNotUpdated.isActiveBool).to.be.true;
    expect(isNotUpdated.activeElementUpdatedBool).to.be.false;
    expect(isBlur.isActiveBool).to.be.false;
    expect(isBlur.activeElementUpdatedBool).to.be.true;
    //console.log("state checker null add ",isBlur)

  })


});
