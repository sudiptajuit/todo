import pytest
from app.crud.todo import (
    get_todos, get_todo, create_todo,
    update_todo, delete_todo
)
from app.schemas.todo import TodoCreate, TodoUpdate
from app.models.todo import Todo

def test_create_todo(db_session):
    """Test creating a new todo"""
    todo_data = TodoCreate(
        title="Test Todo",
        description="Test description",
        completed=False
    )
    todo = create_todo(db_session, todo_data)

    assert todo.id is not None
    assert todo.title == "Test Todo"
    assert todo.description == "Test description"
    assert todo.completed is False
    assert todo.created_at is not None

def test_get_todos(db_session):
    """Test retrieving all todos"""
    # Create some test todos
    for i in range(3):
        todo_data = TodoCreate(title=f"Todo {i}")
        create_todo(db_session, todo_data)

    todos = get_todos(db_session)
    assert len(todos) == 3

def test_get_todo_by_id(db_session):
    """Test retrieving a specific todo"""
    todo_data = TodoCreate(title="Specific Todo")
    created = create_todo(db_session, todo_data)

    retrieved = get_todo(db_session, created.id)
    assert retrieved is not None
    assert retrieved.id == created.id
    assert retrieved.title == "Specific Todo"

def test_update_todo(db_session):
    """Test updating a todo"""
    todo_data = TodoCreate(title="Original Title")
    todo = create_todo(db_session, todo_data)

    update_data = TodoUpdate(
        title="Updated Title",
        description="Updated description",
        completed=True
    )
    updated = update_todo(db_session, todo.id, update_data)

    assert updated is not None
    assert updated.title == "Updated Title"
    assert updated.description == "Updated description"
    assert updated.completed is True

def test_delete_todo(db_session):
    """Test deleting a todo"""
    todo_data = TodoCreate(title="To Delete")
    todo = create_todo(db_session, todo_data)

    result = delete_todo(db_session, todo.id)
    assert result is True

    deleted = get_todo(db_session, todo.id)
    assert deleted is None

def test_delete_nonexistent_todo(db_session):
    """Test deleting a todo that doesn't exist"""
    result = delete_todo(db_session, 999)
    assert result is False
