const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Search Suggestions And Autocomplete', () => {
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

  it('displays search input field', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('input[type="search"],input[placeholder*="Meklē"]').should('be.visible');
  });

  it('shows suggestions on single character', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('a');
    cy.wait(500);
    cy.get('div[class*="suggest"],ul[class*="autocomplete"]').should('be.visible');
  });

  it('displays multiple suggestions', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('test');
    cy.wait(500);
    cy.get('div[class*="suggest"] li,div[class*="suggest"] a').should('have.length.greaterThan', 1);
  });

  it('highlights matching text in suggestions', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('john');
    cy.wait(500);
    cy.get('div[class*="suggest"] mark,div[class*="suggest"] strong').should('exist');
  });

  it('selects suggestion with arrow keys', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('test');
    cy.wait(500);
    cy.get('input[type="search"]').first().type('{downarrow}{enter}');
    cy.url().should('include', 'search');
  });

  it('closes suggestions on escape', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('test');
    cy.wait(500);
    cy.get('input[type="search"]').first().type('{esc}');
    cy.get('div[class*="suggest"]').should('not.be.visible');
  });

  it('shows user suggestions', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('user');
    cy.wait(500);
    cy.get('div[class*="suggest"] img[class*="avatar"],div[class*="suggest"] div[class*="user"]').should('exist');
  });

  it('shows group suggestions', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('group');
    cy.wait(500);
    cy.get('div[class*="suggest"] div[class*="group"]').should('exist');
  });

  it('clears suggestions on input clear', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('test');
    cy.wait(500);
    cy.get('input[type="search"]').first().clear();
    cy.get('div[class*="suggest"]').should('not.be.visible');
  });

  it('handles special characters in search', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('@#$%');
    cy.wait(500);
    cy.get('div[class*="suggest"],div[class*="no-results"]').should('exist');
  });

  it('throttles suggestion requests', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('t');
    cy.wait(100);
    cy.get('input[type="search"]').first().type('e');
    cy.wait(100);
    cy.get('input[type="search"]').first().type('s');
    cy.wait(100);
    cy.get('input[type="search"]').first().type('t');
    cy.wait(500);
    cy.get('div[class*="suggest"]').should('be.visible');
  });

  it('navigates to see all results', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('test');
    cy.wait(500);
    cy.get('a,button').contains(/Skatīt visus|See all/i).click({ force: true });
    cy.url().should('include', 'search');
  });
});
