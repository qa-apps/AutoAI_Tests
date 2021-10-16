const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Header Navigation Menu', () => {
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

  it('displays header navigation bar', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('header,nav[class*="header"],div[class*="navbar"]').should('be.visible');
  });

  it('navigates to home from header', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').contains(/Sākums|Home|Galvenā/i).click({ force: true });
    cy.url().should('include', 'draugiem.lv');
  });

  it('opens photos section from header', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').contains(/Bildes|Photos|Foto/i).click({ force: true });
    cy.url().should('include', 'photo');
  });

  it('navigates to games section', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').contains(/Spēles|Games/i).click({ force: true });
    cy.url().should('include', 'game');
  });

  it('opens music or radio section', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').contains(/Mūzika|Music|Radio/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('navigates to video section', () => {
    loginIfNeeded();
    cy.get('header,nav').find('a,button').contains(/Video|TV/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('checks header logo click', () => {
    loginIfNeeded();
    cy.get('header').find('img[alt*="draugiem"],a[class*="logo"]').first().click({ force: true });
    cy.url().should('include', 'draugiem.lv');
  });

  it('verifies header search bar', () => {
    loginIfNeeded();
    cy.get('header,nav').find('input[type="search"],input[placeholder*="Meklē"]').should('be.visible');
  });

  it('shows user menu dropdown', () => {
    loginIfNeeded();
    cy.get('header').find('img[class*="avatar"],button[class*="user"]').first().click({ force: true });
    cy.get('div[class*="dropdown"],ul[class*="menu"]').should('be.visible');
  });

  it('checks notification icon in header', () => {
    loginIfNeeded();
    cy.get('header').find('a,button').filter('[class*="notification"],[title*="Ziņas"]').should('exist');
  });

  it('verifies messages icon in header', () => {
    loginIfNeeded();
    cy.get('header').find('a,button').filter('[class*="message"],[title*="Vēstules"]').should('exist');
  });

  it('tests header responsiveness', () => {
    loginIfNeeded();
    cy.viewport('iphone-x');
    cy.get('button[class*="hamburger"],button[class*="menu"]').should('be.visible');
    cy.viewport(1280, 720);
  });
});
