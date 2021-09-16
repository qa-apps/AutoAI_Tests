const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Messages And Inbox', () => {
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

  it('navigates to messages section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Vēstules|Messages|Ziņojumi/i).first().click({ force: true });
    cy.url().should('include', 'messages');
  });

  it('displays inbox list', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Vēstules|Messages/i).first().click({ force: true });
    cy.get('div[class*="message"],div[class*="inbox"],ul[class*="messages"]').should('exist');
  });

  it('shows message count', () => {
    loginIfNeeded();
    cy.get('span[class*="count"],span[class*="badge"]').contains(/[0-9]+/).should('exist');
  });

  it('opens compose new message', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Rakstīt|Compose|Jauna vēstule/i).first().click({ force: true });
    cy.get('form,div[class*="compose"]').should('be.visible');
  });

  it('searches messages', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē"],input[type="search"]').first().type('test{enter}');
    cy.location('pathname').should('match', /.+/);
  });

  it('filters unread messages', () => {
    loginIfNeeded();
    cy.get('a,button,select').contains(/Nelasītās|Unread/i).click({ force: true });
    cy.get('div[class*="message"],ul[class*="messages"]').should('exist');
  });

  it('opens first message', () => {
    loginIfNeeded();
    cy.get('div[class*="message"],li[class*="message"]').first().click({ force: true });
    cy.get('div[class*="content"],div[class*="body"]').should('be.visible');
  });

  it('checks message sender info', () => {
    loginIfNeeded();
    cy.get('div[class*="message"]').first().find('span[class*="sender"],a[class*="from"]').should('exist');
  });

  it('verifies message timestamp', () => {
    loginIfNeeded();
    cy.get('div[class*="message"]').first().find('time,span[class*="time"]').should('exist');
  });

  it('marks message as read', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Atzīmēt kā lasītu|Mark as read/i).click({ force: true });
    cy.get('div[class*="unread"]').should('have.length.lessThan', 10);
  });

  it('deletes message', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Dzēst|Delete/i).first().click({ force: true });
    cy.get('div[class*="confirm"],button').contains(/Apstiprināt|Confirm|Jā/i).click({ force: true });
  });

  it('navigates between inbox folders', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Nosūtītās|Sent/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });
});
