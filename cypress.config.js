const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.draugiem.lv',
    viewportWidth: 1366,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    video: false,
    specPattern: ['tests/**/*.cy.js', 'tests/**/*.spec.js', 'cypress/e2e/**/*.cy.js', 'cypress/e2e/**/*.spec.js'],
    env: {
      EMAIL: process.env.CYPRESS_EMAIL || process.env.EMAIL || '',
      PASSWORD: process.env.CYPRESS_PASSWORD || process.env.PASSWORD || ''
    },
    setupNodeEvents() {}
  }
});


