const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Footer Links And Information', () => {
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

  it('displays footer section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('footer,div[class*="footer"]').scrollIntoView().should('be.visible');
  });

  it('navigates to privacy policy', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Privātums|Privacy/i).click({ force: true });
    cy.url().should('include', 'privacy');
  });

  it('opens terms and conditions', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Noteikumi|Terms/i).click({ force: true });
    cy.url().should('include', 'terms');
  });

  it('navigates to help section', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Palīdzība|Help/i).click({ force: true });
    cy.url().should('include', 'help');
  });

  it('opens about page', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Par mums|About/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('checks contact information', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Kontakti|Contact/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('verifies copyright notice', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').should('contain.text', '©');
    cy.get('footer,div[class*="footer"]').should('contain.text', new Date().getFullYear());
  });

  it('opens advertising information', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Reklāma|Advertising/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('navigates to developers page', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a').contains(/Izstrādātājiem|Developers|API/i).click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('checks social media links', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('a[href*="facebook"],a[href*="twitter"],a[href*="instagram"]')
      .should('have.length.greaterThan', 0);
  });

  it('verifies language selector in footer', () => {
    loginIfNeeded();
    cy.get('footer,div[class*="footer"]').find('select,a').contains(/English|Latviešu/i).should('exist');
  });

  it('checks footer links are not broken', () => {
    loginIfNeeded();
    cy.get('footer').find('a:visible').each($el => {
      cy.request({
        url: $el.prop('href'),
        failOnStatusCode: false
      }).its('status').should('be.lessThan', 400);
    });
  });
});
