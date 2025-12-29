const R = require('ramda');
const {SpyneApp} = require('spyne');
const {SpynePluginCmsUITraits} = require('../../app/internal/traits/spyne-plugin-json-cms-ui-traits');
const {expect, assert} = require('chai');

describe('should test spyne plugin cms traits methods', () => {
  const props = {};
  let spyneApp;
  //spyneApp =  SpyneApp.init({debug:true})

  beforeEach(()=>{
    props.el$={};
    props.el$.addClass = (c) =>  c;

  })

  it('spyne plugin cms traits should exist', () => {
    expect(SpynePluginCmsUITraits).to.exist;
  });

  it('should add the class names from the config arr to main view', ()=>{

      const pluginArr = ['bottom', 'right', 'top', 'left8'];

      const addClassesArr = SpynePluginCmsUITraits.spyneCms$UpdatePosition(pluginArr, props.el$);
     expect(addClassesArr).to.deep.equal(['bottom', 'right']);
  });




});
