const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Gifts And Advertisement Sections', () => {
  const email = Cypress.env('EMAIL');
  const password = Cypress.env('PASSWORD');
  const login = new LoginPage();

  function loginIfNeeded() {
    cy.location('search').then(q => {
      if (q.includes('login=0')) {
        login.login(email, password);
        login.assertLoggedIn();
      }
    });
  }

  it('displays gifts section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('div,section').contains(/Dāvanas|Gifts/i).should('be.visible');
  });

  it('shows gift items', () => {
    loginIfNeeded();
    cy.get('div[class*="gift"],img[alt*="gift"]').should('have.length.greaterThan', 0);
  });

  it('opens gift catalog', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Visas dāvanas|All gifts/i).click({ force: true });
    cy.url().should('include', 'gift');
  });

  it('displays advertisement banner', () => {
    loginIfNeeded();
    cy.get('div[class*="banner"],div[class*="ad"],iframe[class*="ad"]').should('exist');
  });

  it('checks multiple ad placements', () => {
    loginIfNeeded();
    cy.get('div[class*="advertisement"],div[class*="sponsor"]').should('have.length.greaterThan', 0);
  });

  it('verifies gift prices display', () => {
    loginIfNeeded();
    cy.get('span[class*="price"],span').contains(/\d+/).should('exist');
  });

  it('searches for specific gift', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē dāvanu"],input[placeholder*="Search gift"]').type('flower{enter}');
    cy.get('div[class*="gift"]').should('exist');
  });

  it('filters gifts by category', () => {
    loginIfNeeded();
    cy.get('button,a,select').contains(/Kategorijas|Categories/i).click({ force: true });
    cy.get('div[class*="category"],ul[class*="filter"]').should('be.visible');
  });

  it('sends gift to friend', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Sūtīt dāvanu|Send gift/i).first().click({ force: true });
    cy.get('form,div[class*="send"]').should('be.visible');
  });

  it('views received gifts', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Saņemtās|Received/i).click({ force: true });
    cy.get('div[class*="gift"],div[class*="received"]').should('exist');
  });

  it('checks sponsored content label', () => {
    loginIfNeeded();
    cy.get('span,div').contains(/Reklāma|Advertisement|Sponsored/i).should('exist');
  });

  it('verifies gift animation or preview', () => {
    loginIfNeeded();
    cy.get('div[class*="gift"]').first().trigger('mouseover');
    cy.get('div[class*="preview"],div[class*="hover"]').should('exist');
  });
});
