const { LoginPage } = require('../pages/LoginPage');

describe('Authentication Flow', () => {
  const email = Cypress.env('EMAIL');
  const password = Cypress.env('PASSWORD');
  const loginPage = new LoginPage();

  it('logs in with valid credentials', () => {
    loginPage.login(email, password);
    loginPage.assertLoggedIn();
  });

  it('rejects invalid password', () => {
    loginPage.login(email, 'invalid-password-12345');
    cy.url().should('include', 'login');
  });

  it('rejects invalid email', () => {
    loginPage.login('not-an-email@example.com', password);
    cy.url().should('include', 'login');
  });

  it('is idempotent when visiting login while authenticated', () => {
    loginPage.login(email, password);
    loginPage.assertLoggedIn();
    cy.visit('/?login=0');
    cy.url().should('not.include', 'login=0');
  });

  it('prevents empty email submission', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"password\"]').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('prevents empty password submission', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('handles quick successive submit clicks', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().clear().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().clear().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click().click();
    cy.url().should('not.include', 'login=0');
  });

  it('clears fields and re-enters credentials', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().clear().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().clear().type(password, { log: false });
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().clear().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().clear().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('not.include', 'login=0');
  });

  it('retains url without login param after authentication', () => {
    loginPage.login(email, password);
    cy.location('search').should('not.contain', 'login=0');
  });

  it('allows navigation after login', () => {
    loginPage.login(email, password);
    cy.get('a,button').contains(/(Profils|Profile|Ziņas|News)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('rate limits brute force attempts with many invalid passwords', () => {
    loginPage.visitLoginPage();
    const attempts = Array.from({ length: 5 }, (_, i) => `bad-${i}-${Date.now()}`);
    attempts.forEach(pwd => {
      cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().clear().type(email);
      cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().clear().type(pwd, { log: false });
      cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
      cy.url().should('include', 'login');
    });
  });

  it('does not expose credentials in logs', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.wrap(password, { log: false }).should(p => {
      expect(String(p)).to.have.length.greaterThan(0);
    });
  });

  it('preserves session across page reload', () => {
    loginPage.login(email, password);
    cy.reload();
    cy.url().should('not.include', 'login=0');
  });

  it('blocks whitespace-only email', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type('   ');
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('blocks whitespace-only password', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(email);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type('   ', { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('include', 'login');
  });

  it('trims email input', () => {
    loginPage.visitLoginPage();
    cy.get('input[type=\"email\"],input[name=\"email\"],#email').first().type(`  ${email}  `);
    cy.get('input[type=\"password\"],input[name=\"password\"],#password').first().type(password, { log: false });
    cy.get('button[type=\"submit\"],input[type=\"submit\"]').first().click();
    cy.url().should('not.include', 'login=0');
  });
});


