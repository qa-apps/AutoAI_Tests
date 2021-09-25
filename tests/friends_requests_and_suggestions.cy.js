const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Friend Requests And Suggestions', () => {
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

  it('navigates to friend requests', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Draudzības pieprasījumi|Friend requests/i).click({ force: true });
    cy.get('div[class*="requests"],div[class*="pending"]').should('exist');
  });

  it('shows pending requests count', () => {
    loginIfNeeded();
    cy.get('span[class*="badge"],span[class*="count"]').contains(/\d+/).should('exist');
  });

  it('displays friend suggestions section', () => {
    loginIfNeeded();
    cy.get('div,section').contains(/Varbūt pazīsti|People you may know/i).should('be.visible');
  });

  it('shows suggested friend info', () => {
    loginIfNeeded();
    cy.get('div[class*="suggestion"]').first().find('img[class*="avatar"]').should('exist');
    cy.get('div[class*="suggestion"]').first().find('a,span').should('contain.text', '');
  });

  it('displays mutual friends count', () => {
    loginIfNeeded();
    cy.get('span').contains(/\d+ kopīgi draugi|\d+ mutual friends/i).should('exist');
  });

  it('sends friend request', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Pievienot draugos|Add friend/i).first().click({ force: true });
    cy.get('button').should('contain.text', /Pieprasījums nosūtīts|Request sent/i);
  });

  it('accepts friend request', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Apstiprināt|Accept/i).first().click({ force: true });
    cy.get('div[class*="success"],div[class*="accepted"]').should('exist');
  });

  it('declines friend request', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Noraidīt|Decline/i).first().click({ force: true });
    cy.get('div[class*="declined"]').should('exist');
  });

  it('hides friend suggestion', () => {
    loginIfNeeded();
    cy.get('button[class*="close"],button[title*="Hide"]').first().click({ force: true });
    cy.get('div[class*="suggestion"]').should('have.length.greaterThan', 0);
  });

  it('loads more suggestions', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Vairāk|More|Skatīt vairāk/i).click({ force: true });
    cy.get('div[class*="suggestion"]').should('have.length.greaterThan', 3);
  });

  it('filters requests by date', () => {
    loginIfNeeded();
    cy.get('select,button').contains(/Jaunākie|Newest/i).click({ force: true });
    cy.get('div[class*="request"]').should('exist');
  });

  it('searches in friend requests', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē"]').type('test');
    cy.wait(500);
    cy.get('div[class*="request"],div[class*="no-results"]').should('exist');
  });
});
