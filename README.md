# AutoAI Tests - Cypress E2E Test Suite

This repository contains automated E2E tests for draugiem.lv using Cypress and JavaScript.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🚀 Setup

1. Clone the repository:
```bash
git clone https://github.com/qa-apps/AutoAI_Tests.git
cd AutoAI_Tests
```

2. Install dependencies:
```bash
npm install
```

3. Configure credentials:
   - The credentials are already configured in `cypress.env.json`
   - Or set environment variables:
```bash
export CYPRESS_EMAIL="your-email@example.com"
export CYPRESS_PASSWORD="your-password"
```

## 🧪 Running Tests

### Interactive Mode (Cypress UI):
```bash
npm run cy:open
```

### Headless Mode (CLI):
```bash
npm run cy:run
```

### Run specific test file:
```bash
npx cypress run --spec "tests/login_flow.cy.js"
```

### Run tests in specific browser:
```bash
npx cypress run --browser chrome
```

## 📁 Project Structure

```
AutoAI_Tests/
├── cypress/
│   ├── e2e/           # Additional test specs
│   ├── pages/         # Page Object Models
│   └── support/       # Support files and commands
├── tests/             # Main test files
│   ├── home_feed_widgets.cy.js
│   ├── top_news_feed.cy.js
│   ├── friend_search_and_results.cy.js
│   └── ... (23 more test files)
├── cypress.config.js  # Cypress configuration
├── cypress.env.json   # Environment variables (gitignored)
└── package.json       # Project dependencies
```

## 📝 Test Coverage

The test suite includes 26 comprehensive test files covering:

- Authentication flows
- User profile management
- Social features (friends, groups, messages)
- Search functionality
- Navigation and UI elements
- Settings and privacy
- Content feeds and timelines
- Session management
- Multi-language support

## 🔧 Configuration

Main configuration is in `cypress.config.js`:
- Base URL: https://www.draugiem.lv
- Viewport: 1366x800
- Default timeout: 8000ms
- Test patterns: `tests/**/*.cy.js` and `cypress/e2e/**/*.cy.js`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

ISC License
