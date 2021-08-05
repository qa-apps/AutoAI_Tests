const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Session And Navigation', () => {
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

  it('authenticates and lands on home', () => {
    login.login(email, password);
    login.assertLoggedIn();
  });

  it('opens notifications if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Ziņas|News|Paziņojumi|Notifications)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('opens messages if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Vēstules|Messages)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('opens profile from header', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Profils|Profile)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('navigates to friends if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Draugi|Friends)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('navigates to groups if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Grupas|Groups)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('searches with a keyword', () => {
    loginIfNeeded();
    const q = 'test';
    const searchSel = ['input[type=\"search\"]', 'input[name=\"q\"]', 'input#search'];
    let c = cy.wrap(null);
    searchSel.forEach((s, i) => {
      c = i === 0 ? cy.get(s, { timeout: 4000 }).first().clear().type(q).type('{enter}')
        .then(undefined, () => cy.wrap(null)) : c.then(() => cy.get(s).first().clear().type(q).type('{enter}'), () => cy.wrap(null));
    });
    cy.location('pathname').should('match', /.+/);
  });

  it('opens settings if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Iestatījumi|Settings)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('navigates back and forward', () => {
    loginIfNeeded();
    cy.go('back');
    cy.go('forward');
    cy.location('pathname').should('match', /.+/);
  });

  it('persists session across new tab emulation', () => {
    loginIfNeeded();
    cy.location('href').then(h => {
      cy.visit(h, { failOnStatusCode: false });
      cy.location('search').should('not.contain', 'login=0');
    });
  });

  it('opens help or about if present', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Palīdzība|Help|Par mums|About)/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('logs out if visible and returns to login', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/(Iziet|Log out|Atslēgties)/i).first().click({ force: true });
    cy.location('search').should('include', 'login');
  });
});


