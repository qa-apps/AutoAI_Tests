const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Groups Navigation And Features', () => {
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

  it('navigates to groups section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Grupas|Groups/i).first().click({ force: true });
    cy.url().should('include', 'group');
  });

  it('displays groups list', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Grupas|Groups/i).first().click({ force: true });
    cy.get('div[class*="group"],article[class*="group"]').should('have.length.greaterThan', 0);
  });

  it('searches for groups', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Meklē"],input[type="search"]').first().type('music{enter}');
    cy.get('div[class*="result"],div[class*="group"]').should('exist');
  });

  it('opens specific group', () => {
    loginIfNeeded();
    cy.get('div[class*="group"],a[href*="/group/"]').first().click({ force: true });
    cy.url().should('include', 'group');
  });

  it('shows group members count', () => {
    loginIfNeeded();
    cy.get('span').contains(/\d+ biedri|\d+ members/i).should('exist');
  });

  it('displays group description', () => {
    loginIfNeeded();
    cy.get('div[class*="description"],p[class*="about"]').should('exist');
  });

  it('checks join group button', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Pievienoties|Join|Iestāties/i).should('exist');
  });

  it('views group posts', () => {
    loginIfNeeded();
    cy.get('div[class*="post"],article[class*="feed"]').should('have.length.greaterThan', 0);
  });

  it('filters my groups', () => {
    loginIfNeeded();
    cy.get('button,a,select').contains(/Manas grupas|My groups/i).click({ force: true });
    cy.get('div[class*="group"]').should('exist');
  });

  it('filters popular groups', () => {
    loginIfNeeded();
    cy.get('button,a,select').contains(/Populārās|Popular/i).click({ force: true });
    cy.get('div[class*="group"]').should('have.length.greaterThan', 0);
  });

  it('creates new group link', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Izveidot grupu|Create group/i).click({ force: true });
    cy.get('form,div[class*="create"]').should('be.visible');
  });

  it('leaves group action', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Izstāties|Leave|Pamest/i).first().click({ force: true });
    cy.get('button').contains(/Apstiprināt|Confirm/i).click({ force: true });
  });
});
