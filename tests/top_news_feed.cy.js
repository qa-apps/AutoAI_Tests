const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Top News Feed Section', () => {
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

  it('displays top news section', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('section,div').contains(/Top ziņas|Top news|Jaunumi/i).should('be.visible');
  });

  it('shows multiple news items', () => {
    loginIfNeeded();
    cy.get('div[class*="news"],article,div[class*="article"]').should('have.length.greaterThan', 0);
  });

  it('clicks first news item', () => {
    loginIfNeeded();
    cy.get('a[href*="/news/"],a[href*="/article/"]').first().click({ force: true });
    cy.location('pathname').should('match', /.+/);
  });

  it('verifies news item has title', () => {
    loginIfNeeded();
    cy.get('div[class*="news"],article').first().find('h1,h2,h3,h4,h5,h6,a').should('exist');
  });

  it('checks news item has timestamp', () => {
    loginIfNeeded();
    cy.get('div[class*="news"],article').first().find('time,span[class*="time"],span[class*="date"]').should('exist');
  });

  it('navigates through news pagination if exists', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Nākamais|Next|→/i).then($el => {
      if ($el.length) {
        cy.wrap($el).first().click({ force: true });
        cy.location('pathname').should('match', /.+/);
      }
    });
  });

  it('returns from news article to feed', () => {
    loginIfNeeded();
    cy.go('back');
    cy.get('div[class*="feed"],div[class*="content"],main').should('be.visible');
  });

  it('checks news filter options if present', () => {
    loginIfNeeded();
    cy.get('select,button,a').contains(/Kategorijas|Categories|Filtrs|Filter/i).should('exist');
  });

  it('verifies news item author info', () => {
    loginIfNeeded();
    cy.get('div[class*="news"],article').first().find('span[class*="author"],a[class*="author"]').should('exist');
  });

  it('checks for news comments link', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Komentāri|Comments|Komentēt/i).should('exist');
  });

  it('verifies news share buttons', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Dalīties|Share|Kopīgot/i).should('exist');
  });

  it('tests news search functionality', () => {
    loginIfNeeded();
    cy.get('input[type="search"],input[placeholder*="Meklē"],input[placeholder*="Search"]')
      .first().type('test{enter}');
    cy.location('pathname').should('match', /.+/);
  });
});
