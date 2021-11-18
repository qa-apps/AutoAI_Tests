const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Privacy Settings And Links', () => {
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

  it('navigates to privacy settings', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Privātums|Privacy/i).first().click({ force: true });
    cy.url().should('include', 'privacy');
  });

  it('displays profile visibility options', () => {
    loginIfNeeded();
    cy.get('label,div').contains(/Profila redzamība|Profile visibility/i).should('exist');
    cy.get('input[type="radio"],select').should('have.length.greaterThan', 0);
  });

  it('sets profile to private', () => {
    loginIfNeeded();
    cy.get('input[type="radio"][value="private"],option').contains(/Privāts|Private/i).click({ force: true });
  });

  it('sets profile to friends only', () => {
    loginIfNeeded();
    cy.get('input[type="radio"],option').contains(/Tikai draugi|Friends only/i).click({ force: true });
  });

  it('configures photo privacy', () => {
    loginIfNeeded();
    cy.get('label').contains(/Bilžu privātums|Photo privacy/i).should('exist');
    cy.get('select,input[type="radio"]').first().should('exist');
  });

  it('manages blocked users list', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Bloķētie lietotāji|Blocked users/i).click({ force: true });
    cy.get('div[class*="blocked"],ul[class*="users"]').should('exist');
  });

  it('blocks a user', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Lietotāja vārds"],input[placeholder*="Username"]').type('testuser');
    cy.get('button').contains(/Bloķēt|Block/i).click({ force: true });
    cy.get('div[class*="blocked"]').should('contain.text', 'testuser');
  });

  it('unblocks a user', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Atbloķēt|Unblock/i).first().click({ force: true });
    cy.get('button').contains(/Apstiprināt|Confirm/i).click({ force: true });
  });

  it('configures search privacy', () => {
    loginIfNeeded();
    cy.get('label').contains(/Meklēšanas privātums|Search privacy/i).should('exist');
    cy.get('input[type="checkbox"]').should('exist');
  });

  it('sets timeline privacy', () => {
    loginIfNeeded();
    cy.get('label').contains(/Laika līnijas privātums|Timeline privacy/i).should('exist');
    cy.get('select,input[type="radio"]').should('exist');
  });

  it('manages app permissions', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Lietotņu atļaujas|App permissions/i).click({ force: true });
    cy.get('div[class*="apps"],div[class*="permissions"]').should('exist');
  });

  it('saves privacy settings', () => {
    loginIfNeeded();
    cy.get('input[type="radio"],input[type="checkbox"]').first().click({ force: true });
    cy.get('button[type="submit"]').contains(/Saglabāt|Save/i).click({ force: true });
    cy.get('div[class*="success"]').should('exist');
  });
});
