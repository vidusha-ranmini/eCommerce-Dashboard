# Contributing to eCommerce Admin Dashboard

First off, thank you for considering contributing to this project! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, PostgreSQL version)

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11]
 - Node Version: [e.g. 18.0.0]
 - PostgreSQL Version: [e.g. 14.0]
 - Browser: [e.g. Chrome 120]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `beginner-friendly` - Easy to get started

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/eCommerce-Dashboard.git
cd eCommerce-Dashboard
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Development Environment

```bash
cp .env.example .env
# Edit .env with your local configuration
```

### 5. Setup Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

### 6. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Coding Standards

### JavaScript Style Guide

We follow standard JavaScript best practices:

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Classes: PascalCase
class UserController {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files: camelCase or kebab-case
// userController.js or user-controller.js
```

#### Code Formatting

```javascript
// Use 2 spaces for indentation
function example() {
  const data = {
    name: 'test',
    value: 123
  };
  
  if (condition) {
    doSomething();
  }
}

// Use single quotes for strings
const message = 'Hello World';

// Add spaces around operators
const sum = a + b;

// Use semicolons
const value = 10;
```

#### Best Practices

```javascript
// Use async/await instead of callbacks
async function getData() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Use const by default, let when reassignment is needed
const immutable = 'value';
let mutable = 10;
mutable += 5;

// Destructuring
const { name, email } = user;
const [first, second] = array;

// Template literals
const greeting = `Hello, ${userName}!`;

// Arrow functions for callbacks
array.map(item => item.value);
```

### Database Models

```javascript
// Model definition
const ModelName = sequelize.define('ModelName', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fieldName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'table_name',
  timestamps: true
});
```

### API Controllers

```javascript
// Controller pattern
const controllerName = async (req, res) => {
  try {
    // Validate input
    const { param } = req.body;
    
    if (!param) {
      return res.status(400).json({
        error: 'Parameter is required'
      });
    }
    
    // Business logic
    const result = await Model.findOne({ where: { param } });
    
    // Success response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
```

### Comments

```javascript
// Use JSDoc for functions
/**
 * Calculate the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {number} Total price with tax
 */
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}

// Single line comments for clarification
// Calculate shipping cost based on weight
const shippingCost = weight * 2.5;

// Multi-line comments for complex logic
/*
 * This function handles the complex order processing workflow:
 * 1. Validate inventory
 * 2. Calculate totals
 * 3. Process payment
 * 4. Update stock
 */
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(orders): correct total calculation for discounts"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(models): simplify user validation logic"

# Multiple changes
git commit -m "feat(products): add image upload

- Add multer middleware for file uploads
- Create image storage service
- Update product model with imageUrl field

Closes #123"
```

## Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   npm run dev
   # Manually test features
   ```

3. **Check for errors**
   - No console errors
   - Database migrations work
   - API endpoints respond correctly

4. **Update documentation**
   - Update README if needed
   - Add/update API docs
   - Comment complex code

### Creating Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Use a clear title
   - Fill out the PR template
   - Link related issues

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe your testing process

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests pass locally
   ```

### Review Process

1. At least one maintainer review required
2. Address review comments
3. Keep PR updated with main branch
4. Once approved, maintainer will merge

### After Your PR is Merged

1. Delete your feature branch
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. Update your fork
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Project Structure

Understanding the project structure:

```
src/
├── adminjs/              # AdminJS configuration
│   ├── components/       # Custom React components
│   ├── dashboardHandler.js
│   ├── resources.js      # Resource configurations
│   └── index.js
├── config/
│   └── database.js       # Database connection
├── controllers/          # Request handlers
│   └── authController.js
├── middleware/          # Express middleware
│   └── auth.js
├── models/              # Sequelize models
│   ├── User.js
│   ├── Product.js
│   ├── ...
│   └── index.js         # Model relationships
├── routes/              # API routes
│   └── authRoutes.js
├── scripts/             # Utility scripts
│   ├── migrate.js
│   └── seed.js
└── server.js           # Main application entry
```

### Adding a New Feature

#### 1. Model
Create in `src/models/ModelName.js`

#### 2. Resource Configuration
Add to `src/adminjs/resources.js`

#### 3. Controller (if needed)
Create in `src/controllers/modelController.js`

#### 4. Routes (if API needed)
Add to appropriate file in `src/routes/`

#### 5. Update Migrations
Run `npm run db:migrate` after model changes

## Testing

Currently manual testing is used. We welcome contributions for automated tests!

### Manual Testing Checklist

- [ ] Server starts without errors
- [ ] Database connection works
- [ ] Login works (admin and user)
- [ ] CRUD operations work
- [ ] Role-based access enforced
- [ ] API endpoints respond correctly

## Documentation

When adding features:

1. Update README.md if needed
2. Add JSDoc comments to functions
3. Update API.md for new endpoints
4. Add examples where helpful

## Questions?

Don't hesitate to ask! Create an issue labeled `question` or reach out to maintainers.

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in the community

---

Thank you for contributing! 🙌
