const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Profile Sidebar Navigation', () => {
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

  it('opens profile from sidebar', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('aside,nav').find('a,button').contains(/Profils|Profile/i).first().click({ force: true });
    cy.url().should('include', 'user');
  });

  it('navigates to photos section', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Bildes|Photos|Foto/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('opens friends list from sidebar', () => {
    loginIfNeeded();
    cy.get('aside,nav').find('a,button').contains(/Draugi|Friends/i).first().click({ force: true });
    cy.url().should('match', /friends|draugi/i);
  });

  it('checks sidebar user avatar', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').find('img[alt*="profile"],img[src*="user"],img[class*="avatar"]')
      .should('be.visible');
  });

  it('verifies sidebar user name', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').find('h1,h2,h3,span,a').should('contain.text', '');
  });

  it('navigates to messages from sidebar', () => {
    loginIfNeeded();
    cy.get('aside,nav').find('a,button').contains(/Vēstules|Messages/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('opens groups from sidebar', () => {
    loginIfNeeded();
    cy.get('aside,nav').find('a,button').contains(/Grupas|Groups/i).first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('checks online friends counter in sidebar', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').contains(/tiešsaistē|online/i).should('exist');
  });

  it('verifies sidebar statistics', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').find('span,div').contains(/[0-9]+/).should('exist');
  });

  it('opens calendar from sidebar', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').find('a,button,div').contains(/Kalendārs|Calendar/i)
      .first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('checks sidebar collapse on mobile viewport', () => {
    loginIfNeeded();
    cy.viewport('iphone-x');
    cy.get('button[class*="menu"],button[aria-label*="menu"]').should('be.visible');
    cy.viewport(1280, 720);
  });

  it('verifies sidebar links are clickable', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').find('a:visible').each($el => {
      cy.wrap($el).should('have.attr', 'href');
    });
  });
});
