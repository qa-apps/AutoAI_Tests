const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Home Feed Scroll And Lazy Loading', () => {
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

  it('displays initial feed items', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('div[class*="feed"],article[class*="post"]').should('have.length.greaterThan', 0);
  });

  it('loads more content on scroll', () => {
    loginIfNeeded();
    cy.get('div[class*="feed"],article').then($initial => {
      const initialCount = $initial.length;
      cy.scrollTo('bottom');
      cy.wait(1000);
      cy.get('div[class*="feed"],article').should('have.length.greaterThan', initialCount);
    });
  });

  it('shows loading indicator on scroll', () => {
    loginIfNeeded();
    cy.scrollTo('bottom');
    cy.get('div[class*="loading"],div[class*="spinner"]').should('be.visible');
  });

  it('maintains scroll position on refresh', () => {
    loginIfNeeded();
    cy.scrollTo(0, 500);
    cy.window().its('scrollY').should('be.greaterThan', 400);
    cy.reload();
    cy.window().its('scrollY').should('be.greaterThan', 0);
  });

  it('loads images lazily', () => {
    loginIfNeeded();
    cy.get('img[loading="lazy"],img[data-src]').should('exist');
  });

  it('scrolls to top button appears', () => {
    loginIfNeeded();
    cy.scrollTo('bottom');
    cy.get('button[class*="top"],button[title*="top"]').should('be.visible');
  });

  it('returns to top on button click', () => {
    loginIfNeeded();
    cy.scrollTo('bottom');
    cy.get('button[class*="top"],button[title*="top"]').click({ force: true });
    cy.window().its('scrollY').should('be.lessThan', 100);
  });

  it('handles infinite scroll endpoint', () => {
    loginIfNeeded();
    for(let i = 0; i < 3; i++) {
      cy.scrollTo('bottom');
      cy.wait(500);
    }
    cy.get('div').contains(/Nav vairāk|No more|End/i).should('exist');
  });

  it('preserves feed state on navigation back', () => {
    loginIfNeeded();
    cy.scrollTo(0, 1000);
    cy.get('a[href*="/user/"]').first().click({ force: true });
    cy.go('back');
    cy.get('div[class*="feed"]').should('be.visible');
  });

  it('updates feed with new posts indicator', () => {
    loginIfNeeded();
    cy.wait(2000);
    cy.get('button,div').contains(/Jauni ieraksti|New posts/i).should('exist');
  });

  it('scrolls smoothly between sections', () => {
    loginIfNeeded();
    cy.get('div[class*="feed"]').first().scrollIntoView({ duration: 500 });
    cy.get('footer').scrollIntoView({ duration: 500 });
    cy.get('header').scrollIntoView({ duration: 500 });
  });

  it('handles horizontal scroll in widgets', () => {
    loginIfNeeded();
    cy.get('div[class*="horizontal"],div[style*="overflow-x"]').first().scrollTo('right');
    cy.get('div[class*="horizontal"],div[style*="overflow-x"]').first().scrollTo('left');
  });
});
