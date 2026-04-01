import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Use SQLite in-memory for fast unit tests
SQLITE_TEST_DB_URL = "sqlite:///:memory:"

def create_test_engine():
    """Create a database engine for tests"""
    engine = create_engine(
        SQLITE_TEST_DB_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    return engine

@pytest.fixture(scope="session")
def test_settings():
    """Settings for testing (not used directly, but provided for reference)"""
    return {
        'DATABASE_URL': SQLITE_TEST_DB_URL,
        'SECRET_KEY': 'test-secret-key',
        'API_V1_STR': '/api/v1'
    }

@pytest.fixture(scope="function")
def db_engine():
    """Create a fresh database engine for each test"""
    # Set test database URL before any app imports
    os.environ['DATABASE_URL'] = SQLITE_TEST_DB_URL

    engine = create_test_engine()

    # Import after env is set so models use correct metadata
    from app.database import Base
    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)
    engine.dispose()

@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a fresh database session for each test"""
    Session = sessionmaker(bind=db_engine)
    session = Session()
    try:
        yield session
        session.rollback()
    finally:
        session.close()

@pytest.fixture
def client(db_session):
    """Create a test FastAPI client"""
    # Ensure env var is set
    os.environ['DATABASE_URL'] = SQLITE_TEST_DB_URL

    from fastapi.testclient import TestClient
    from app.main import app
    from app.database import get_db

    # Override the get_db dependency
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
