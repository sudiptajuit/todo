#!/bin/bash
set -e

echo "Starting Docker Compose for E2E tests..."
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 15

echo "Running Playwright tests..."
cd frontend
npm run test:e2e

TEST_RESULT=$?

echo "Stopping Docker Compose..."
docker-compose down

exit $TEST_RESULT
