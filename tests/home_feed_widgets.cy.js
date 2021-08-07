const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Home Feed And Widgets', () => {
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

  it('displays main feed after login', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('div[class*="feed"],div[class*="content"],main').should('be.visible');
  });

  it('shows friend search widget', () => {
    loginIfNeeded();
    cy.get('div,section').contains(/Atrodi draugus|Find friends/i).should('be.visible');
  });

  it('displays calendar widget in sidebar', () => {
    loginIfNeeded();
    cy.get('div,aside').contains(/Mans kalendārs|My calendar/i).should('exist');
  });

  it('shows online friends counter', () => {
    loginIfNeeded();
    cy.get('div,span').contains(/tiešsaistē|online/i).should('exist');
  });

  it('displays top news section', () => {
    loginIfNeeded();
    cy.get('div,section').contains(/Top ziņas|Top news/i).should('exist');
  });

  it('verifies friend suggestions widget', () => {
    loginIfNeeded();
    cy.get('div').contains(/Varbūt pazīsti|You might know/i).should('exist');
  });

  it('shows advertisement sections', () => {
    loginIfNeeded();
    cy.get('div[class*="ad"],div[class*="banner"],aside').should('have.length.greaterThan', 0);
  });

  it('displays user profile card in sidebar', () => {
    loginIfNeeded();
    cy.get('div[class*="profile"],aside').find('img[alt*="profile"],img[src*="user"]').should('exist');
  });

  it('shows notifications icon in header', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').filter(':contains("Ziņas"), :contains("Notifications")').should('exist');
  });

  it('verifies feed refresh behavior', () => {
    loginIfNeeded();
    cy.reload();
    cy.get('div[class*="feed"],div[class*="content"],main').should('be.visible');
  });

  it('checks gift section visibility', () => {
    loginIfNeeded();
    cy.get('div,section').contains(/Dāvanas|Gifts/i).should('exist');
  });

  it('validates main content area structure', () => {
    loginIfNeeded();
    cy.get('body').find('main,div[role="main"],div[class*="main"]').should('have.length.greaterThan', 0);
  });
});
