import { ViewStream } from 'spyne'
import { IntegrationTemplateTestVS } from './integration-template-test.js'
//import fixture from './integration-tests.json'

/**
 * IntegrationTestRunnerVS
 *
 * Page-level ViewStream that iterates the integration-tests fixture and
 * mounts one IntegrationTemplateTestVS per test case via appendView(),
 * using the list-element selector as the second argument so each card
 * lands inside .integration-test-runner__list.
 *
 * Drop this onto any page to run the full suite visually. Each test's
 * pass/fail status renders inline. Use the browser console to see the
 * per-test log output.
 */
export class IntegrationTestRunner extends ViewStream {
  constructor(props = {}) {
    const template = `
      <section class="integration-test-runner">
        <header class="integration-test-runner__header">
          <h1>DomElementTemplate — Integration Tests</h1>
          <p class="integration-test-runner__count">{{count}} test cases</p>
        </header>
        <div class="integration-test-runner__list"></div>
      </section>
    `

    const {fixture} = props;

    super({
      ...props,
      template,
      data: {
        count: fixture.length
      }
    })
  }

  onRendered() {
    this.props.fixture.forEach(testCase => {
      const testVS = new IntegrationTemplateTestVS(testCase)
      this.appendView(testVS, '.integration-test-runner__list')
    })
  }
}
