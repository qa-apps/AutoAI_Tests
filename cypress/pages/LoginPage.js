/**
 * @class LoginPage
 * @classdesc Encapsulates login interactions for draugiem.lv
 */
class LoginPage {
  /**
   * Visits the login page.
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  visitLoginPage() {
    return cy.visit('/?login=0');
  }

  /**
   * Types email into the login form.
   * @param {string} email
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  typeEmail(email) {
    const selectorCandidates = [
      'input[name=\"email\"]',
      'input#email',
      'input[type=\"email\"]'
    ];
    let chain = cy.wrap(null);
    selectorCandidates.forEach((sel, idx) => {
      chain = idx === 0 ? cy.get(sel, { timeout: 4000 }).first().clear().type(email, { delay: 0 })
        .then(undefined, () => cy.wrap(null)) : chain.then(() => cy.get(sel).first().clear().type(email, { delay: 0 }), () => cy.wrap(null));
    });
    return chain;
  }

  /**
   * Types password into the login form.
   * @param {string} password
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  typePassword(password) {
    const selectorCandidates = [
      'input[name=\"password\"]',
      'input#password',
      'input[type=\"password\"]'
    ];
    let chain = cy.wrap(null);
    selectorCandidates.forEach((sel, idx) => {
      chain = idx === 0 ? cy.get(sel, { timeout: 4000 }).first().clear().type(password, { log: false })
        .then(undefined, () => cy.wrap(null)) : chain.then(() => cy.get(sel).first().clear().type(password, { log: false }), () => cy.wrap(null));
    });
    return chain;
  }

  /**
   * Submits the login form.
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  submitLogin() {
    const buttonCandidates = [
      'button[type=\"submit\"]',
      'input[type=\"submit\"]',
      'button:contains(\"Login\")',
      'button:contains(\"Ienākt\")'
    ];
    let chain = cy.wrap(null);
    buttonCandidates.forEach((sel, idx) => {
      chain = idx === 0 ? cy.get(sel, { timeout: 4000 }).first().click()
        .then(undefined, () => cy.wrap(null)) : chain.then(() => cy.get(sel).first().click(), () => cy.wrap(null));
    });
    return chain;
  }

  /**
   * Asserts that a logged-in state is reached.
   * @returns {Cypress.Chainable}
   */
  assertLoggedIn() {
    return cy.url().should('not.include', 'login=0');
  }

  /**
   * Attempts to log in with given credentials.
   * @param {string} email
   * @param {string} password
   * @returns {Cypress.Chainable}
   */
  login(email, password) {
    return this.visitLoginPage()
      .then(() => this.typeEmail(email))
      .then(() => this.typePassword(password))
      .then(() => this.submitLogin());
  }
}

module.exports = { LoginPage };


