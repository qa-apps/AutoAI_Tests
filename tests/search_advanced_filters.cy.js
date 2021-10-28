const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Advanced Search Filters', () => {
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

  it('navigates to advanced search', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Izvērstā meklēšana|Advanced search/i).click({ force: true });
    cy.get('form[class*="advanced"],div[class*="filters"]').should('be.visible');
  });

  it('filters by people', () => {
    loginIfNeeded();
    cy.get('input[type="radio"],button').contains(/Cilvēki|People/i).click({ force: true });
    cy.get('div[class*="people"],div[class*="users"]').should('exist');
  });

  it('filters by groups', () => {
    loginIfNeeded();
    cy.get('input[type="radio"],button').contains(/Grupas|Groups/i).click({ force: true });
    cy.get('div[class*="groups"]').should('exist');
  });

  it('filters by location', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Pilsēta"],input[placeholder*="City"]').type('Riga');
    cy.get('button[type="submit"]').click({ force: true });
    cy.get('div[class*="result"]').should('exist');
  });

  it('filters by age range', () => {
    loginIfNeeded();
    cy.get('input[name*="age_from"],select[name*="age_from"]').type('18');
    cy.get('input[name*="age_to"],select[name*="age_to"]').type('30');
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('filters by gender', () => {
    loginIfNeeded();
    cy.get('input[type="radio"][value="male"],option').contains(/Vīrietis|Male/i).click({ force: true });
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('filters by relationship status', () => {
    loginIfNeeded();
    cy.get('select,input[type="radio"]').contains(/Neprecējies|Single/i).click({ force: true });
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('filters by interests', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Intereses"],input[name*="interests"]').type('music');
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('combines multiple filters', () => {
    loginIfNeeded();
    cy.get('input[placeholder*="Pilsēta"]').type('Riga');
    cy.get('input[name*="age_from"]').type('20');
    cy.get('input[type="radio"][value="female"]').click({ force: true });
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('clears all filters', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Notīrīt|Clear/i).click({ force: true });
    cy.get('input[type="text"]').should('have.value', '');
  });

  it('saves search filters', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Saglabāt meklēšanu|Save search/i).click({ force: true });
    cy.get('input[placeholder*="Nosaukums"],input[name*="name"]').type('My Search');
    cy.get('button[type="submit"]').click({ force: true });
  });

  it('loads saved search', () => {
    loginIfNeeded();
    cy.get('select,a').contains(/Saglabātās|Saved/i).click({ force: true });
    cy.get('div[class*="saved"],ul[class*="searches"]').should('exist');
  });
});
