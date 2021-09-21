const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Notification Settings Management', () => {
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

  it('navigates to notification settings', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Iestatījumi|Settings/i).first().click({ force: true });
    cy.get('a,li,button').contains(/Paziņojumi|Notifications/i).click({ force: true });
    cy.get('div[class*="notifications"],form[class*="settings"]').should('be.visible');
  });

  it('displays email notification options', () => {
    loginIfNeeded();
    cy.get('label').contains(/E-pasta paziņojumi|Email notifications/i).should('exist');
    cy.get('input[type="checkbox"]').should('have.length.greaterThan', 0);
  });

  it('toggles friend request notifications', () => {
    loginIfNeeded();
    cy.get('label').contains(/Draudzības pieprasījumi|Friend requests/i)
      .parent().find('input[type="checkbox"]').click({ force: true });
  });

  it('toggles message notifications', () => {
    loginIfNeeded();
    cy.get('label').contains(/Jaunas vēstules|New messages/i)
      .parent().find('input[type="checkbox"]').click({ force: true });
  });

  it('toggles birthday reminders', () => {
    loginIfNeeded();
    cy.get('label').contains(/Dzimšanas dienas|Birthdays/i)
      .parent().find('input[type="checkbox"]').click({ force: true });
  });

  it('toggles event invitations', () => {
    loginIfNeeded();
    cy.get('label').contains(/Pasākumu uzaicinājumi|Event invitations/i)
      .parent().find('input[type="checkbox"]').click({ force: true });
  });

  it('sets notification frequency', () => {
    loginIfNeeded();
    cy.get('select').contains(/Uzreiz|Immediately|Reizi dienā|Daily/i).parent().select(1);
  });

  it('disables all notifications', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Atslēgt visus|Disable all/i).click({ force: true });
    cy.get('input[type="checkbox"]:checked').should('have.length', 0);
  });

  it('enables all notifications', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Ieslēgt visus|Enable all/i).click({ force: true });
    cy.get('input[type="checkbox"]:checked').should('have.length.greaterThan', 0);
  });

  it('saves notification settings', () => {
    loginIfNeeded();
    cy.get('input[type="checkbox"]').first().click({ force: true });
    cy.get('button[type="submit"]').contains(/Saglabāt|Save/i).click({ force: true });
    cy.get('div[class*="success"],div[class*="saved"]').should('exist');
  });

  it('shows push notification settings', () => {
    loginIfNeeded();
    cy.get('label,div').contains(/Push paziņojumi|Push notifications/i).should('exist');
  });

  it('tests notification preview', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Testa paziņojums|Test notification/i).click({ force: true });
    cy.get('div[class*="notification"],div[class*="toast"]').should('be.visible');
  });
});
