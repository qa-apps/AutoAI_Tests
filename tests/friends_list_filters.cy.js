const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Friends List And Filters', () => {
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

  it('navigates to friends list', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Draugi|Friends/i).first().click({ force: true });
    cy.url().should('include', 'friends');
  });

  it('displays friends grid', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Draugi|Friends/i).first().click({ force: true });
    cy.get('div[class*="friend"],div[class*="user-card"]').should('have.length.greaterThan', 0);
  });

  it('shows online friends filter', () => {
    loginIfNeeded();
    cy.get('button,a,select').contains(/Tiešsaistē|Online/i).click({ force: true });
    cy.get('div[class*="online"],span[class*="status"]').should('exist');
  });

  it('filters all friends', () => {
    loginIfNeeded();
    cy.get('button,a,select').contains(/Visi|All/i).click({ force: true });
    cy.get('div[class*="friend"]').should('have.length.greaterThan', 0);
  });

  it('searches within friends', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē"],input[type="search"]').first().type('test');
    cy.wait(500);
    cy.get('div[class*="friend"],div[class*="result"]').should('exist');
  });

  it('opens friend profile', () => {
    loginIfNeeded();
    cy.get('div[class*="friend"]').first().click({ force: true });
    cy.url().should('include', 'user');
  });

  it('shows friend request section', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Pieprasījumi|Requests/i).click({ force: true });
    cy.get('div[class*="request"],div[class*="pending"]').should('exist');
  });

  it('displays mutual friends count', () => {
    loginIfNeeded();
    cy.get('span').contains(/kopīgi|mutual/i).should('exist');
  });

  it('sorts friends alphabetically', () => {
    loginIfNeeded();
    cy.get('select,button').contains(/Alfabētiski|Alphabetical|A-Z/i).click({ force: true });
    cy.get('div[class*="friend"]').should('have.length.greaterThan', 0);
  });

  it('shows friend suggestions', () => {
    loginIfNeeded();
    cy.get('div,section').contains(/Varbūt pazīsti|You might know/i).should('exist');
  });

  it('unfriends user action', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Noņemt no draugu|Unfriend|Remove/i).first().click({ force: true });
    cy.get('button').contains(/Apstiprināt|Confirm/i).click({ force: true });
  });

  it('verifies friends count display', () => {
    loginIfNeeded();
    cy.get('span,div').contains(/\d+ draugi|\d+ friends/i).should('exist');
  });
});
