const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Sidebar Modules And Visibility', () => {
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

  it('displays sidebar on desktop', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.viewport(1280, 720);
    cy.get('aside,div[class*="sidebar"]').should('be.visible');
  });

  it('hides sidebar on mobile', () => {
    loginIfNeeded();
    cy.viewport('iphone-x');
    cy.get('aside,div[class*="sidebar"]').should('not.be.visible');
  });

  it('toggles sidebar on tablet', () => {
    loginIfNeeded();
    cy.viewport('ipad-2');
    cy.get('button[class*="toggle"],button[class*="menu"]').click({ force: true });
    cy.get('aside,div[class*="sidebar"]').should('be.visible');
  });

  it('shows user info module', () => {
    loginIfNeeded();
    cy.viewport(1280, 720);
    cy.get('aside').find('div[class*="user"],div[class*="profile"]').should('be.visible');
  });

  it('displays calendar module', () => {
    loginIfNeeded();
    cy.get('aside').find('div[class*="calendar"]').should('be.visible');
  });

  it('shows friends online module', () => {
    loginIfNeeded();
    cy.get('aside').find('div[class*="friends"],div[class*="online"]').should('exist');
  });

  it('displays ads module in sidebar', () => {
    loginIfNeeded();
    cy.get('aside').find('div[class*="ad"],div[class*="banner"]').should('exist');
  });

  it('collapses expandable modules', () => {
    loginIfNeeded();
    cy.get('aside').find('button[class*="collapse"],div[class*="toggle"]').first().click({ force: true });
    cy.get('div[class*="collapsed"]').should('exist');
  });

  it('expands collapsed modules', () => {
    loginIfNeeded();
    cy.get('aside').find('button[class*="expand"],div[class*="toggle"]').first().click({ force: true });
    cy.get('div[class*="expanded"]').should('exist');
  });

  it('scrolls within sidebar', () => {
    loginIfNeeded();
    cy.get('aside,div[class*="sidebar"]').scrollTo('bottom');
    cy.get('aside,div[class*="sidebar"]').scrollTo('top');
  });

  it('maintains sidebar state on navigation', () => {
    loginIfNeeded();
    cy.get('aside').should('be.visible');
    cy.get('a[href*="/messages"]').first().click({ force: true });
    cy.go('back');
    cy.get('aside').should('be.visible');
  });

  it('adjusts sidebar on window resize', () => {
    loginIfNeeded();
    cy.viewport(1920, 1080);
    cy.get('aside').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('aside').should('exist');
    cy.viewport(1280, 720);
  });
});
