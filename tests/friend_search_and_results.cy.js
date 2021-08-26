const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Friend Search And Results', () => {
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

  it('displays search bar', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('input[type="search"],input[name="q"],input[placeholder*="Meklē"]').should('be.visible');
  });

  it('performs basic search', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"],input[placeholder*="Meklē"]')
      .first().clear().type('test{enter}');
    cy.url().should('include', 'search');
  });

  it('shows search suggestions on typing', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('a');
    cy.wait(500);
    cy.get('div[class*="suggest"],ul[class*="dropdown"],div[class*="autocomplete"]').should('exist');
  });

  it('clicks on search suggestion', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('test');
    cy.wait(500);
    cy.get('div[class*="suggest"],ul[class*="dropdown"]').first().find('a,li').first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('searches for people', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('John{enter}');
    cy.get('div[class*="result"],div[class*="user"],article').should('have.length.greaterThan', 0);
  });

  it('opens user profile from search results', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('test{enter}');
    cy.get('a[href*="/user/"],a[href*="/profile/"]').first().click({ force: true });
    cy.url().should('include', 'user');
  });

  it('uses advanced search link if available', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Izvērstā meklēšana|Advanced search/i).click({ force: true });
    cy.location('pathname').should('include', 'search');
  });

  it('filters search by type', () => {
    loginIfNeeded();
    cy.get('a,button,select').contains(/Cilvēki|People|Personas/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('clears search input', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('test');
    cy.get('button[class*="clear"],span[class*="clear"]').click({ force: true });
    cy.get('input[type="search"],input[name="q"]').should('have.value', '');
  });

  it('searches with special characters', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('test@123{enter}');
    cy.url().should('include', 'search');
  });

  it('verifies empty search behavior', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('{enter}');
    cy.get('div[class*="result"],div[class*="error"]').should('exist');
  });

  it('navigates back from search results', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[name="q"]').first().clear().type('test{enter}');
    cy.go('back');
    cy.get('div[class*="feed"],main').should('be.visible');
  });
});
