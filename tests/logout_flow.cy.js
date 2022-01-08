const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Logout Flow And Session Management', () => {
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

  it('finds logout button in header', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('header').find('img[class*="avatar"],button[class*="user"]').first().click({ force: true });
    cy.get('a,button').contains(/Iziet|Log out|Atslēgties/i).should('be.visible');
  });

  it('logs out from dropdown menu', () => {
    loginIfNeeded();
    cy.get('header').find('img[class*="avatar"],button[class*="user"]').first().click({ force: true });
    cy.get('a,button').contains(/Iziet|Log out/i).click({ force: true });
    cy.url().should('include', 'login');
  });

  it('logs out from settings page', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iestatījumi|Settings/i).first().click({ force: true });
    cy.get('a,button').contains(/Iziet|Log out/i).click({ force: true });
    cy.url().should('include', 'login');
  });

  it('redirects to login after logout', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.get('input[type="email"],input[type="password"]').should('be.visible');
  });

  it('clears session cookies on logout', () => {
    loginIfNeeded();
    cy.getCookies().should('have.length.greaterThan', 0);
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.getCookies().should('have.length.lessThan', 5);
  });

  it('prevents access to protected pages after logout', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.visit('/messages', { failOnStatusCode: false });
    cy.url().should('include', 'login');
  });

  it('shows logout confirmation if enabled', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.get('button,div').contains(/Apstiprināt|Confirm|Jā/i).click({ force: true });
  });

  it('cancels logout action', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.get('button').contains(/Atcelt|Cancel|Nē/i).click({ force: true });
    cy.url().should('not.include', 'login');
  });

  it('logs out from all devices option', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet no visām ierīcēm|Log out from all devices/i).click({ force: true });
    cy.url().should('include', 'login');
  });

  it('handles expired session', () => {
    loginIfNeeded();
    cy.clearCookies();
    cy.reload();
    cy.url().should('include', 'login');
  });

  it('shows logged out message', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    cy.get('div[class*="message"],div[class*="alert"]').should('contain.text', /Jūs esat izrakstījies|You have been logged out/i);
  });

  it('can log back in after logout', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Iziet|Log out/i).first().click({ force: true });
    login.login(email, password);
    login.assertLoggedIn();
  });
});
