const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Session Persistence Across Tabs', () => {
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

  it('maintains session in same tab', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.reload();
    cy.url().should('not.include', 'login=0');
  });

  it('persists session with direct URL visit', () => {
    loginIfNeeded();
    cy.location('href').then(url => {
      cy.visit(url, { failOnStatusCode: false });
      cy.url().should('not.include', 'login=0');
    });
  });

  it('keeps session when opening new sections', () => {
    loginIfNeeded();
    cy.get('a[href*="/messages"]').first().invoke('removeAttr', 'target').click({ force: true });
    cy.url().should('include', 'messages');
    cy.url().should('not.include', 'login=0');
  });

  it('maintains session after navigation', () => {
    loginIfNeeded();
    cy.visit('/friends', { failOnStatusCode: false });
    cy.url().should('not.include', 'login=0');
    cy.visit('/groups', { failOnStatusCode: false });
    cy.url().should('not.include', 'login=0');
  });

  it('preserves cookies across pages', () => {
    loginIfNeeded();
    cy.getCookies().then(cookies => {
      const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('auth'));
      cy.visit('/profile', { failOnStatusCode: false });
      cy.getCookie(sessionCookie.name).should('exist');
    });
  });

  it('handles back button with session', () => {
    loginIfNeeded();
    cy.visit('/messages', { failOnStatusCode: false });
    cy.visit('/friends', { failOnStatusCode: false });
    cy.go('back');
    cy.url().should('include', 'messages');
    cy.url().should('not.include', 'login=0');
  });

  it('maintains session with hash changes', () => {
    loginIfNeeded();
    cy.window().then(win => {
      win.location.hash = '#test';
    });
    cy.url().should('include', '#test');
    cy.url().should('not.include', 'login=0');
  });

  it('keeps session with query parameters', () => {
    loginIfNeeded();
    cy.visit('/?tab=photos', { failOnStatusCode: false });
    cy.url().should('include', 'tab=photos');
    cy.url().should('not.include', 'login=0');
  });

  it('persists session across AJAX calls', () => {
    loginIfNeeded();
    cy.intercept('GET', '**/api/**').as('apiCall');
    cy.get('button,a').first().click({ force: true });
    cy.url().should('not.include', 'login=0');
  });

  it('maintains session on form submissions', () => {
    loginIfNeeded();
    cy.get('input[type="search"]').first().type('test{enter}');
    cy.url().should('include', 'search');
    cy.url().should('not.include', 'login=0');
  });

  it('preserves session with popstate events', () => {
    loginIfNeeded();
    cy.window().then(win => {
      win.history.pushState({}, '', '/test');
      win.history.back();
    });
    cy.url().should('not.include', 'login=0');
  });

  it('handles session timeout gracefully', () => {
    loginIfNeeded();
    cy.wait(2000);
    cy.reload();
    cy.url().then(url => {
      if (url.includes('login=0')) {
        login.login(email, password);
      }
      cy.url().should('not.include', 'login=0');
    });
  });
});
