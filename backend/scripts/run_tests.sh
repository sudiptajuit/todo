#!/bin/bash
set -e

echo "Running backend tests..."

# Check if we're in the right directory
if [ ! -f "../requirements.txt" ]; then
  echo "Error: This script should be run from the backend/scripts directory"
  exit 1
fi

cd ..

# Run migrations for test database (if using Postgres)
# alembic upgrade head  # Not needed for SQLite in-memory, but kept for reference

# Run tests
pytest tests/ \
    --verbose \
    --cov=app \
    --cov-report=term-missing \
    --cov-report=html \
    --junitxml=test-results.xml

echo "Tests completed!"
echo "Coverage report available at: htmlcov/index.html"
