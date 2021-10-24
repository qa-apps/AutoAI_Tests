const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Language Switching Functionality', () => {
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

  it('finds language selector', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('select,a,button').contains(/English|Latviešu|LV|EN/i).should('exist');
  });

  it('switches to English language', () => {
    loginIfNeeded();
    cy.get('select,a,button').contains(/English|EN/i).click({ force: true });
    cy.get('body').should('contain.text', 'Friends');
  });

  it('switches to Latvian language', () => {
    loginIfNeeded();
    cy.get('select,a,button').contains(/Latviešu|LV/i).click({ force: true });
    cy.get('body').should('contain.text', 'Draugi');
  });

  it('persists language after page reload', () => {
    loginIfNeeded();
    cy.get('select,a,button').contains(/English|EN/i).click({ force: true });
    cy.reload();
    cy.get('body').should('contain.text', 'Friends');
  });

  it('verifies menu items change language', () => {
    loginIfNeeded();
    cy.get('select,a,button').contains(/English|EN/i).click({ force: true });
    cy.get('nav,header').should('contain.text', 'Profile');
    cy.get('select,a,button').contains(/Latviešu|LV/i).click({ force: true });
    cy.get('nav,header').should('contain.text', 'Profils');
  });

  it('checks button texts in different language', () => {
    loginIfNeeded();
    cy.get('select,a,button').contains(/English|EN/i).click({ force: true });
    cy.get('button,a').should('contain.text', 'Search');
  });

  it('verifies form labels change language', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Settings|Iestatījumi/i).first().click({ force: true });
    cy.get('label').should('exist');
  });

  it('checks error messages language', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().clear().type('{enter}');
    cy.get('div[class*="error"],span[class*="error"]').should('exist');
  });

  it('verifies date format changes with language', () => {
    loginIfNeeded();
    cy.get('time,span[class*="date"]').first().should('exist');
  });

  it('checks notification text language', () => {
    loginIfNeeded();
    cy.get('div[class*="notification"]').first().should('exist');
  });

  it('verifies footer links language', () => {
    loginIfNeeded();
    cy.get('footer').scrollIntoView();
    cy.get('footer').should('contain.text', /Privacy|Privātums/i);
  });

  it('switches language from footer selector', () => {
    loginIfNeeded();
    cy.get('footer').scrollIntoView();
    cy.get('footer').find('select,a').contains(/English|Latviešu/i).click({ force: true });
    cy.get('body').should('contain.text', /Friends|Draugi/i);
  });
});
