# ToDo Application

Full-stack ToDo application built with React, TypeScript, FastAPI, and PostgreSQL.

## Features

- Create, Read, Update, Delete ToDo items
- Async backend with proper error handling
- Database migrations with Alembic
- Responsive UI with loading states
- Docker Compose orchestration

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development without Docker)

### Development (with Docker)

```bash
cd todo-app
docker-compose up --build
```

- Frontend: http://localhost:3001 (or 3000 if port 3000 is available)
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Development (local)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Initialize Alembic (first time only)
alembic init alembic

# Configure alembic/env.py with your DATABASE_URL (or use .env)
# Then run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000

# In another terminal, create new migrations after model changes:
# alembic revision --autogenerate -m "Your migration message"
# alembic upgrade head

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/todos` - List all todos
- `GET /api/todos/{id}` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

## Testing

The project includes comprehensive testing at all levels:

### Backend Tests (pytest)

The backend tests use **pytest** with SQLite in-memory database for isolation and speed.

```bash
cd backend

# Install dependencies (includes test dependencies)
pip install -r requirements.txt

# Run all tests with coverage
pytest tests/ --cov=app --cov-report=term-missing --cov-report=html

# Or use the provided script
./scripts/run_tests.sh

# Or with Make
make test-backend

# View coverage report
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov\index.html  # Windows
```

**Test Structure:**
- `tests/unit/` - Unit tests for CRUD operations and models
- `tests/integration/` - API endpoint integration tests
- `tests/conftest.py` - Shared fixtures for database and FastAPI client

### Frontend Tests (Vitest)

The frontend tests use **Vitest** with React Testing Library for component testing.

```bash
cd frontend

# Install dependencies
npm install

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Or with Make
make test-frontend

# View coverage report
open coverage/lcov-report/index.html
```

**Test Structure:**
- `src/test/services/` - API service tests with mocked axios
- `src/test/components/` - Component unit tests
- `src/test/setup.ts` - Test environment setup

### E2E Tests (Playwright)

Full end-to-end tests using **Playwright** to test complete user flows.

```bash
# Ensure Docker Compose is NOT running (script will start it)
./scripts/run-e2e-tests.sh

# Or manually:
docker-compose up -d
cd frontend
npm run test:e2e
docker-compose down
```

**Test Coverage:**
- Adding new todos
- Toggling completion status
- Editing existing todos
- Deleting todos with confirmation

### Run All Tests

```bash
# Backend + Frontend unit tests
make test

# All tests including E2E
make test-all
```

## Test Configuration

- **Backend coverage threshold:** >80% line coverage recommended
- **Frontend coverage threshold:** >70% component coverage recommended
- **Test isolation:** Each test uses a fresh database transaction with rollback
- **CI/CD:** GitHub Actions workflow `.github/workflows/test.yml` for automated testing

## Project Structure

See the implementation plan at `.claude/plans/todo-fullstack.md` for detailed file structure and code.
