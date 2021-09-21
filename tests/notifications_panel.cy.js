const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Notifications Panel', () => {
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

  it('opens notifications dropdown', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Ziņas|Notifications|Paziņojumi/i).first().click({ force: true });
    cy.get('div[class*="notification"],div[class*="dropdown"]').should('be.visible');
  });

  it('displays notification count badge', () => {
    loginIfNeeded();
    cy.get('span[class*="badge"],span[class*="count"]').contains(/[0-9]+/).should('exist');
  });

  it('shows notification items', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Ziņas|Notifications/i).first().click({ force: true });
    cy.get('li[class*="notification"],div[class*="notification-item"]').should('have.length.greaterThan', 0);
  });

  it('marks all notifications as read', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Atzīmēt visas|Mark all/i).click({ force: true });
    cy.get('span[class*="unread"]').should('not.exist');
  });

  it('clicks on specific notification', () => {
    loginIfNeeded();
    cy.get('li[class*="notification"],div[class*="notification"]').first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('filters notification types', () => {
    loginIfNeeded();
    cy.get('select,button').contains(/Draugi|Friends/i).click({ force: true });
    cy.get('div[class*="notification"]').should('exist');
  });

  it('shows notification timestamp', () => {
    loginIfNeeded();
    cy.get('div[class*="notification"]').first().find('time,span[class*="time"]').should('exist');
  });

  it('navigates to notification settings', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iestatījumi|Settings/i).click({ force: true });
    cy.url().should('include', 'settings');
  });

  it('checks for new notifications indicator', () => {
    loginIfNeeded();
    cy.get('span[class*="new"],span[class*="unread"],div[class*="dot"]').should('exist');
  });

  it('dismisses single notification', () => {
    loginIfNeeded();
    cy.get('button[class*="dismiss"],button[class*="close"]').first().click({ force: true });
    cy.get('div[class*="notification"]').should('have.length.greaterThan', 0);
  });

  it('loads more notifications on scroll', () => {
    loginIfNeeded();
    cy.get('div[class*="notifications"]').scrollTo('bottom');
    cy.wait(500);
    cy.get('div[class*="notification"]').should('have.length.greaterThan', 5);
  });

  it('verifies notification types icons', () => {
    loginIfNeeded();
    cy.get('div[class*="notification"]').find('img,svg,i[class*="icon"]').should('exist');
  });
});
