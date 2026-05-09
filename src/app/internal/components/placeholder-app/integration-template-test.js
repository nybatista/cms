import { ViewStream, DomElement, DomElementTemplate } from 'spyne'
import { PlaceholderAppIntegrationTestsTraits } from '../../traits/placeholder-app-integration-tests-traits';

/**
 * IntegrationTemplateTestVS
 *
 * One instance per test case. Renders:
 *   - A test card with pass/fail status, test name, description
 *   - The template-under-test, rendered with its test data, inside .integration-test__output
 *   - A diff panel (visible when the test fails)
 *
 * Props (passed in at instantiation):
 *   { testName, description, template, data, inlineExpectedOutput }
 *
 * The ViewStream's own `template` is the wrapper card. The template-under-test
 * is resolved via PlaceholderAppIntegrationTestsTraits.integrationTest$GetTemplate() and
 * pre-rendered into a string using DomElementTemplate directly — this is the
 * code path we want to exercise. The resulting HTML is embedded into the card
 * via a triple-mustache tag so it passes through the outer card render
 * unchanged.
 *
 * After rendering, onRendered() fires integrationTest$TestRendered() from the
 * trait, which walks the rendered DOM, normalizes, and asserts.
 */
export class IntegrationTemplateTestVS extends ViewStream {
  constructor(props = {}) {
    const cardTemplate = `
      <article class="integration-test" data-test-name="{{testName}}">
        <header class="integration-test__header">
          <span class="integration-test__status integration-test__status--pending">…</span>
          <span class="integration-test__name">{{testName}}</span>
          <span class="integration-test__description">{{description}}</span>
        </header>
        <div class="integration-test__output">{{rendered}}</div>
        <div class="integration-test__diff"></div>
      </article>
    `

    // Resolve the template-under-test and render it using DomElementTemplate
    // directly. This is the code path that exercises the patched parser:
    //   - new DomElementTemplate(testTemplate, testData)
    //   - renderToString() produces the output we'll normalize & assert
    const testTemplate = PlaceholderAppIntegrationTestsTraits.integrationTest$GetTemplate(props.template)
    let rendered = ''
    try {
      const tpl = new DomElementTemplate(testTemplate, props.data, { testMode: true })
      rendered = tpl.renderToString()
    } catch (e) {
      rendered = `<pre style="color:#c52929;">RENDER ERROR: ${e.message}</pre>`
      console.error(`IntegrationTemplateTestVS[${props.testName}]:`, e)
    }

    super({
      ...props,
      template: cardTemplate,
      data: {
        testName: props.testName,
        description: props.description,
        rendered
      },
      traits: [PlaceholderAppIntegrationTestsTraits]
    })
  }

  onRendered() {
    // Fire the assertion after the card is in the DOM.
    this.integrationTest$TestRendered(this.props)
  }
}
