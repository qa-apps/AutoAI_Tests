const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Profile Edit Entry Points', () => {
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

  it('navigates to profile page', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Profils|Profile/i).first().click({ force: true });
    cy.url().should('include', 'user');
  });

  it('finds edit profile button', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Profils|Profile/i).first().click({ force: true });
    cy.get('a,button').contains(/Rediģēt|Edit/i).should('be.visible');
  });

  it('opens edit profile from button', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Rediģēt profilu|Edit profile/i).first().click({ force: true });
    cy.get('form,div[class*="edit"]').should('be.visible');
  });

  it('shows profile picture edit option', () => {
    loginIfNeeded();
    cy.get('img[class*="avatar"],img[class*="profile"]').first().trigger('mouseover');
    cy.get('button,a').contains(/Mainīt|Change|Upload/i).should('exist');
  });

  it('displays basic info edit fields', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Rediģēt|Edit/i).first().click({ force: true });
    cy.get('input[name*="name"],input[type="text"]').should('have.length.greaterThan', 0);
  });

  it('shows about me edit section', () => {
    loginIfNeeded();
    cy.get('textarea[name*="about"],textarea[placeholder*="Par mani"]').should('exist');
  });

  it('displays interests edit section', () => {
    loginIfNeeded();
    cy.get('input[name*="interests"],textarea[name*="interests"]').should('exist');
  });

  it('shows contact info edit fields', () => {
    loginIfNeeded();
    cy.get('input[type="tel"],input[name*="phone"]').should('exist');
  });

  it('displays work info edit section', () => {
    loginIfNeeded();
    cy.get('input[name*="work"],input[placeholder*="Darbs"]').should('exist');
  });

  it('shows education edit fields', () => {
    loginIfNeeded();
    cy.get('input[name*="education"],input[placeholder*="Izglītība"]').should('exist');
  });

  it('cancels profile edit', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Rediģēt|Edit/i).first().click({ force: true });
    cy.get('button,a').contains(/Atcelt|Cancel/i).click({ force: true });
    cy.get('form[class*="edit"]').should('not.exist');
  });

  it('validates required fields', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Rediģēt|Edit/i).first().click({ force: true });
    cy.get('input[required]').first().clear();
    cy.get('button[type="submit"]').click({ force: true });
    cy.get('div[class*="error"],span[class*="error"]').should('exist');
  });
});
