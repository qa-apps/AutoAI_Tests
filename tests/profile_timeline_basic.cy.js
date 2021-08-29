const { LoginPage } = require('../cypress/pages/LoginPage');

describe('Profile Timeline And Posts', () => {
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

  it('navigates to own profile', () => {
    login.login(email, password);
    login.assertLoggedIn();
    cy.get('a,button').contains(/Mans profils|My profile/i).first().click({ force: true });
    cy.url().should('include', 'user');
  });

  it('displays profile timeline', () => {
    loginIfNeeded();
    cy.get('a,button').contains(/Profils|Profile/i).first().click({ force: true });
    cy.get('div[class*="timeline"],div[class*="posts"],div[class*="wall"]').should('be.visible');
  });

  it('shows profile posts', () => {
    loginIfNeeded();
    cy.get('article[class*="post"],div[class*="entry"],div[class*="status"]').should('have.length.greaterThan', 0);
  });

  it('creates new post', () => {
    loginIfNeeded();
    cy.get('textarea[placeholder*="Ko tu domā"],textarea[placeholder*="What are you thinking"]').type('Test post');
    cy.get('button').contains(/Publicēt|Post|Share/i).click({ force: true });
    cy.get('div[class*="success"],article').should('contain.text', 'Test post');
  });

  it('likes a post', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Patīk|Like|👍/i).first().click({ force: true });
    cy.get('span[class*="likes"]').should('contain.text', /\d+/);
  });

  it('comments on post', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Komentēt|Comment/i).first().click({ force: true });
    cy.get('textarea[placeholder*="Raksti komentāru"],input[placeholder*="Write a comment"]').type('Test comment{enter}');
    cy.get('div[class*="comment"]').should('contain.text', 'Test comment');
  });

  it('shares a post', () => {
    loginIfNeeded();
    cy.get('button,a').contains(/Dalīties|Share/i).first().click({ force: true });
    cy.get('button').contains(/Publicēt|Post/i).click({ force: true });
    cy.get('div[class*="shared"]').should('exist');
  });

  it('deletes own post', () => {
    loginIfNeeded();
    cy.get('button[class*="menu"],button[class*="options"]').first().click({ force: true });
    cy.get('button,a').contains(/Dzēst|Delete/i).click({ force: true });
    cy.get('button').contains(/Apstiprināt|Confirm/i).click({ force: true });
  });

  it('edits post', () => {
    loginIfNeeded();
    cy.get('button[class*="menu"],button[class*="options"]').first().click({ force: true });
    cy.get('button,a').contains(/Rediģēt|Edit/i).click({ force: true });
    cy.get('textarea').clear().type('Edited post');
    cy.get('button').contains(/Saglabāt|Save/i).click({ force: true });
  });

  it('filters timeline by year', () => {
    loginIfNeeded();
    cy.get('select,a').contains(new Date().getFullYear().toString()).click({ force: true });
    cy.get('div[class*="timeline"]').should('be.visible');
  });

  it('views post statistics', () => {
    loginIfNeeded();
    cy.get('span,a').contains(/\d+ skatījumi|\d+ views/i).should('exist');
  });

  it('loads more timeline posts', () => {
    loginIfNeeded();
    cy.scrollTo('bottom');
    cy.get('button,a').contains(/Vairāk|More|Ielādēt/i).click({ force: true });
    cy.get('article[class*="post"]').should('have.length.greaterThan', 5);
  });
});
