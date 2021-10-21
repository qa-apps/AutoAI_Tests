const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Settings And Account Management', () => {
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

  it('navigates to settings page', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Iestatījumi|Settings/i).first().click({ force: true });
    cy.url().should('include', 'settings');
  });

  it('displays account settings section', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iestatījumi|Settings/i).first().click({ force: true });
    cy.get('div[class*="settings"],form[class*="account"]').should('be.visible');
  });

  it('shows profile settings tab', () => {
    loginIfNeeded();
    cy.get('a,button,li').contains(/Profils|Profile/i).click({ force: true });
    cy.get('input[name*="name"],input[type="text"]').should('exist');
  });

  it('displays privacy settings', () => {
    loginIfNeeded();
    cy.get('a,button,li').contains(/Privātums|Privacy/i).click({ force: true });
    cy.get('input[type="checkbox"],input[type="radio"],select').should('have.length.greaterThan', 0);
  });

  it('shows notification preferences', () => {
    loginIfNeeded();
    cy.get('a,button,li').contains(/Paziņojumi|Notifications/i).click({ force: true });
    cy.get('input[type="checkbox"],label').should('have.length.greaterThan', 0);
  });

  it('displays email settings', () => {
    loginIfNeeded();
    cy.get('div,label').contains(/E-pasts|Email/i).should('exist');
    cy.get('input[type="email"],input[value*="@"]').should('be.visible');
  });

  it('shows password change section', () => {
    loginIfNeeded();
    cy.get('a,button,li').contains(/Parole|Password/i).click({ force: true });
    cy.get('input[type="password"]').should('have.length.greaterThan', 1);
  });

  it('verifies save button presence', () => {
    loginIfNeeded();
    cy.get('button,input[type="submit"]').contains(/Saglabāt|Save/i).should('be.visible');
  });

  it('checks language preference setting', () => {
    loginIfNeeded();
    cy.get('select,div').contains(/Valoda|Language/i).should('exist');
  });

  it('displays blocked users list', () => {
    loginIfNeeded();
    cy.get('a,button,li').contains(/Bloķētie|Blocked/i).click({ force: true });
    cy.get('div[class*="blocked"],ul[class*="users"]').should('exist');
  });

  it('shows account deletion option', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Dzēst kontu|Delete account/i).should('exist');
  });

  it('verifies settings save confirmation', () => {
    loginIfNeeded();
    cy.get('input[type="text"]').first().clear().type('Test Name');
    cy.get('button,input[type="submit"]').contains(/Saglabāt|Save/i).click({ force: true });
    cy.get('div[class*="success"],div[class*="message"]').should('exist');
  });
});
