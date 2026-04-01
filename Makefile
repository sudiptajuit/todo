.PHONY: all test test-backend test-frontend test-e2e test-all coverage clean

test:
	@echo "Running all tests..."
	@echo ""
	@echo "=== Backend Tests ==="
	@cd backend && pytest tests/ --cov=app --cov-report=term-missing
	@echo ""
	@echo "=== Frontend Tests ==="
	@cd frontend && npm test -- --run
	@echo ""
	@echo "=== All tests passed! ==="

test-all: test test-e2e
	@echo "=== ALL TESTS (including E2E) PASSED! ==="

test-backend:
	cd backend && pytest tests/ --cov=app --cov-report=term-missing -v

test-frontend:
	cd frontend && npm test -- --run

test-e2e:
	./scripts/run-e2e-tests.sh

coverage:
	cd backend && pytest tests/ --cov=app --cov-report=html
	@echo "Backend coverage report available at: backend/htmlcov/index.html"
	cd frontend && npm run test:coverage
	@echo "Frontend coverage report available at: frontend/coverage/lcov-report/index.html"

clean:
	rm -rf backend/htmlcov/
	rm -rf frontend/coverage/
	rm -f backend/.coverage
	rm -f frontend/.coverage
	rm -rf backend/.pytest_cache
