const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Help And Support Pages', () => {
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

  it('navigates to help section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Palīdzība|Help/i).first().click({ force: true });
    cy.url().should('include', 'help');
  });

  it('displays FAQ section', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Palīdzība|Help/i).first().click({ force: true });
    cy.get('div,section').contains(/FAQ|Biežāk uzdotie/i).should('exist');
  });

  it('expands FAQ item', () => {
    loginIfNeeded();
    cy.get('div[class*="faq"],div[class*="question"]').first().click({ force: true });
    cy.get('div[class*="answer"],div[class*="content"]').should('be.visible');
  });

  it('searches help articles', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē palīdzību"],input[placeholder*="Search help"]').type('password{enter}');
    cy.get('div[class*="result"],article').should('have.length.greaterThan', 0);
  });

  it('navigates to contact support', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Sazināties|Contact/i).click({ force: true });
    cy.get('form,div[class*="contact"]').should('be.visible');
  });

  it('shows help categories', () => {
    loginIfNeeded();
    cy.get('ul[class*="categories"],div[class*="topics"]').should('exist');
    cy.get('li,a').contains(/Konts|Account/i).should('exist');
  });

  it('opens specific help article', () => {
    loginIfNeeded();
    cy.get('a[href*="/help/article"],a[class*="article"]').first().click({ force: true });
    cy.get('article,div[class*="content"]').should('be.visible');
  });

  it('rates help article', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Noderīgi|Helpful|👍/i).click({ force: true });
    cy.get('div[class*="thanks"],div[class*="feedback"]').should('exist');
  });

  it('navigates between help articles', () => {
    loginIfNeeded();
    cy.get('a').contains(/Nākamais|Next/i).click({ force: true });
    cy.get('article,div[class*="content"]').should('be.visible');
  });

  it('returns to help home', () => {
    loginIfNeeded();
    cy.get('a').contains(/Palīdzības sākums|Help home/i).click({ force: true });
    cy.get('div[class*="help"],section[class*="support"]').should('be.visible');
  });

  it('checks video tutorials section', () => {
    loginIfNeeded();
    cy.get('a,div').contains(/Video|Pamācības/i).click({ force: true });
    cy.get('iframe,video,div[class*="video"]').should('exist');
  });

  it('submits support ticket', () => {
    loginIfNeeded();
    cy.get('textarea[name*="message"],textarea[placeholder*="Apraksti"]').type('Test support request');
    cy.get('button[type="submit"]').contains(/Sūtīt|Send/i).click({ force: true });
    cy.get('div[class*="success"],div[class*="sent"]').should('exist');
  });
});
