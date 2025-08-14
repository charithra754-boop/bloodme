# Contributing to Blood Donor & Alert System

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker (optional)

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd bloodme

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start development servers
cd backend && npm run start:dev
cd frontend && npm run dev
```

## Branch Strategy

- `main` - Production-ready code
- `development` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

## Commit Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## Pull Request Process

1. Create feature branch from `development`
2. Make changes and test locally
3. Update documentation if needed
4. Submit PR to `development` branch
5. Code review and approval
6. Merge to `development`
7. Deploy to staging for testing
8. Merge to `main` for production

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions