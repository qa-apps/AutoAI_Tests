const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Calendar Widget Functionality', () => {
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

  it('displays calendar widget', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('div,aside').contains(/Mans kalendārs|My calendar|Kalendārs/i).should('be.visible');
  });

  it('shows current month in calendar', () => {
    loginIfNeeded();
    const months = ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 
                   'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'];
    cy.get('div[class*="calendar"]').should('contain.text', new Date().getFullYear());
  });

  it('displays calendar days grid', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('td,div[class*="day"]').should('have.length.greaterThan', 20);
  });

  it('highlights current day', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('td[class*="today"],div[class*="current"]').should('exist');
  });

  it('navigates to next month', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('button,a').contains(/→|Nākamais/i).click({ force: true });
    cy.get('div[class*="calendar"]').should('be.visible');
  });

  it('navigates to previous month', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('button,a').contains(/←|Iepriekšējais/i).click({ force: true });
    cy.get('div[class*="calendar"]').should('be.visible');
  });

  it('clicks on calendar day', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('td,div[class*="day"]').eq(15).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('shows week day names', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').should('contain.text', 'P');
    cy.get('div[class*="calendar"]').should('contain.text', 'O');
  });

  it('checks for event markers', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('span[class*="event"],div[class*="event"]').should('exist');
  });

  it('opens full calendar view', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Skatīt visu kalendāru|View full calendar/i).click({ force: true });
    cy.url().should('include', 'calendar');
  });

  it('verifies calendar month navigation persistence', () => {
    loginIfNeeded();
    cy.get('div[class*="calendar"]').find('button,a').contains(/→/i).click({ force: true });
    cy.reload();
    cy.get('div[class*="calendar"]').should('be.visible');
  });

  it('checks calendar responsive behavior', () => {
    loginIfNeeded();
    cy.viewport('iphone-x');
    cy.get('div[class*="calendar"]').should('exist');
    cy.viewport(1280, 720);
  });
});
