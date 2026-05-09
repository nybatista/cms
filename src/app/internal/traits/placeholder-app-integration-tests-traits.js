import { SpyneTrait } from 'spyne';
// Template imports — each .tmpl.html file exports its raw template string.
// Names match fixture testName fields exactly.
import TmplSingleVariable                    from '../components/placeholder-app/templates/integration-test-templates/singleVariable.tmpl.html'
import TmplDotNotation                       from '../components/placeholder-app/templates/integration-test-templates/dotNotation.tmpl.html'
import TmplStringArrayLoop                   from '../components/placeholder-app/templates/integration-test-templates/stringArrayLoop.tmpl.html'
import TmplObjectArrayLoop                   from '../components/placeholder-app/templates/integration-test-templates/objectArrayLoop.tmpl.html'
import TmplObjectSectionConditional          from '../components/placeholder-app/templates/integration-test-templates/objectSectionConditional.tmpl.html'
import TmplNestedArrayOfArrays               from '../components/placeholder-app/templates/integration-test-templates/nestedArrayOfArrays.tmpl.html'
import TmplNestedObjectsWithInnerObjectArray from '../components/placeholder-app/templates/integration-test-templates/nestedObjectsWithInnerObjectArray.tmpl.html'
import TmplOuterVariableAcrossInnerLoop      from '../components/placeholder-app/templates/integration-test-templates/outerVariableAcrossInnerLoop.tmpl.html'
import TmplEmptyOuterArray                   from '../components/placeholder-app/templates/integration-test-templates/emptyOuterArray.tmpl.html'
import TmplEmptyInnerArray                   from '../components/placeholder-app/templates/integration-test-templates/emptyInnerArray.tmpl.html'
import TmplMissingLoopKey                    from '../components/placeholder-app/templates/integration-test-templates/missingLoopKey.tmpl.html'
import TmplSiblingLoops                      from '../components/placeholder-app/templates/integration-test-templates/siblingLoops.tmpl.html'
import TmplRootLevelArray                    from '../components/placeholder-app/templates/integration-test-templates/rootLevelArray.tmpl.html'
import TmplPrimitiveTagArray                 from '../components/placeholder-app/templates/integration-test-templates/primitiveTagArray.tmpl.html'
import TmplDotPathArrayIndex                 from '../components/placeholder-app/templates/integration-test-templates/dotPathArrayIndex.tmpl.html'
import TmplDollarSignInData                  from '../components/placeholder-app/templates/integration-test-templates/dollarSignInData.tmpl.html'
import TmplCurlyBracesInData                 from '../components/placeholder-app/templates/integration-test-templates/curlyBracesInData.tmpl.html'
import TmplLoopIndexAndNum                   from '../components/placeholder-app/templates/integration-test-templates/loopIndexAndNum.tmpl.html'
import TmplDeepNestingGracefulDegrade        from '../components/placeholder-app/templates/integration-test-templates/deepNestingGracefulDegrade.tmpl.html'
import TmplDotNotationInsideLoop             from '../components/placeholder-app/templates/integration-test-templates/dotNotationInsideLoop.tmpl.html'

export class PlaceholderAppIntegrationTestsTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'integrationTest$';
    super(context, traitPrefix);
  }

  static integrationTest$GetTemplate(templateName) {
    const registry = {
      singleVariable:                    TmplSingleVariable,
      dotNotation:                       TmplDotNotation,
      stringArrayLoop:                   TmplStringArrayLoop,
      objectArrayLoop:                   TmplObjectArrayLoop,
      objectSectionConditional:          TmplObjectSectionConditional,
      nestedArrayOfArrays:               TmplNestedArrayOfArrays,
      nestedObjectsWithInnerObjectArray: TmplNestedObjectsWithInnerObjectArray,
      outerVariableAcrossInnerLoop:      TmplOuterVariableAcrossInnerLoop,
      emptyOuterArray:                   TmplEmptyOuterArray,
      emptyInnerArray:                   TmplEmptyInnerArray,
      missingLoopKey:                    TmplMissingLoopKey,
      siblingLoops:                      TmplSiblingLoops,
      rootLevelArray:                    TmplRootLevelArray,
      primitiveTagArray:                 TmplPrimitiveTagArray,
      dotPathArrayIndex:                 TmplDotPathArrayIndex,
      dollarSignInData:                  TmplDollarSignInData,
      curlyBracesInData:                 TmplCurlyBracesInData,
      loopIndexAndNum:                   TmplLoopIndexAndNum,
      deepNestingGracefulDegrade:        TmplDeepNestingGracefulDegrade,
      dotNotationInsideLoop:             TmplDotNotationInsideLoop,
    }

    const tmpl = registry[templateName]
    if (tmpl === undefined) {
      console.warn(`PlaceholderAppIntegrationTestsTraits: no template registered for "${templateName}"`)
    }
    return tmpl
  }

  /**
   * Whitespace-normalized comparison.
   * Matches the normalization used when authoring inlineExpectedOutput in the
   * fixture — collapses whitespace between tags, collapses runs of spaces
   * inside text, trims both ends. This ignores cosmetic differences (indent,
   * trailing newlines, attribute-order whitespace) while still catching real
   * rendering bugs (missing tags, wrong values, leaked tokens).
   */
  static integrationTest$NormalizeHTML(str = '') {
    return String(str)
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
  }

  /**
   * Asserts that the rendered output of the ViewStream matches its expected
   * output. Renders the result into the DOM of the test card itself for
   * visual inspection.
   *
   * `props` is the test-case object from the fixture:
   *   { testName, description, template, data, inlineExpectedOutput }
   *
   * `this` is the ViewStream instance, so we can read from its rendered DOM.
   */
  integrationTest$TestRendered(props = this.props) {
    const { testName, inlineExpectedOutput } = props

    // The test-card ViewStream's template (see IntegrationTemplateTestVS)
    // contains a .test-output element where the template-under-test is
    // actually rendered. Read its innerHTML for comparison.
    const outputEl = this.props.el$('.integration-test__output').el
    const statusEl = this.props.el$('.integration-test__status').el
    const diffEl   = this.props.el$('.integration-test__diff').el

    const actual = outputEl ? outputEl.innerHTML : ''

    const normalizedActual   = PlaceholderAppIntegrationTestsTraits.integrationTest$NormalizeHTML(actual)
    const normalizedExpected = PlaceholderAppIntegrationTestsTraits.integrationTest$NormalizeHTML(inlineExpectedOutput)

    const passed = normalizedActual === normalizedExpected

    if (statusEl) {
      statusEl.classList.remove('integration-test__status--pending')
      statusEl.classList.add(passed
          ? 'integration-test__status--pass'
          : 'integration-test__status--fail')
      statusEl.textContent = passed ? 'PASS' : 'FAIL'
    }

    if (!passed && diffEl) {
      diffEl.innerHTML = `
        <div class="integration-test__diff-label">Expected:</div>
        <pre class="integration-test__diff-expected">${this.integrationTest$EscapeHTML(normalizedExpected)}</pre>
        <div class="integration-test__diff-label">Actual:</div>
        <pre class="integration-test__diff-actual">${this.integrationTest$EscapeHTML(normalizedActual)}</pre>
      `
    }

    // Log to console for batch-mode debugging
    if (passed) {
      console.log(`%c✓ ${testName}`, 'color: #2f9671')
    } else {
      console.log(`%c✗ ${testName}`, 'color: #c52929; font-weight: bold')
      console.log('  expected:', normalizedExpected)
      console.log('  actual:  ', normalizedActual)
    }

    return passed
  }

  integrationTest$EscapeHTML(str = '') {
    return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  }
}
