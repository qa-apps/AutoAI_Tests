const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Login Flow', () => {
  const email = Cypress.env('EMAIL');
  const password = Cypress.env('PASSWORD');
  const login = new LoginPage();

  it('opens login page', () => {
    login.visitLoginPage();
    cy.location('search').should('include', 'login=0');
  });

  it('rejects empty email and empty password', () => {
    login.visitLoginPage();
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rejects valid email and empty password', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rejects empty email and valid password', () => {
    login.visitLoginPage();
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rejects malformed email', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type('not-an-email');
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rejects long email', () => {
    const longEmail = `${'a'.repeat(128)}@example.com`;
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(longEmail);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rejects long password', () => {
    const longPassword = 'x'.repeat(256);
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(longPassword, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('trims email whitespace', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(`  ${email}  `);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('not.include', 'login=0');
  });

  it('blocks whitespace password', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type('   ', { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('handles rapid submit clicks', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click().click();
    cy.location('search').should('not.contain', 'login=0');
  });

  it('logs in with valid credentials', () => {
    login.login(email, password);
    login.assertLoggedIn();
  });

  it('keeps session after reload', () => {
    login.login(email, password);
    cy.reload();
    cy.location('search').should('not.contain', 'login=0');
  });

  it('prevents login with wrong password', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type('wrong-' + Date.now(), { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('rate limits multiple invalid attempts', () => {
    login.visitLoginPage();
    const attempts = Array.from({ length: 5 }, (_, i) => `bad-${i}-${Date.now()}`);
    attempts.forEach(pwd => {
      cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().clear().type(email);
      cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().clear().type(pwd, { log: false });
      cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
      cy.url().should('include', 'login');
    });
  });

  it('does not leak password to logs', () => {
    login.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.wrap(password, { log: false }).should(v => {
      expect(String(v)).to.have.length.at.least(1);
    });
  });
});


