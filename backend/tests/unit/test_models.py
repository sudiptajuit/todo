import pytest
from app.models.todo import Todo

def test_todo_model_attributes():
    """Test that Todo model has correct attributes"""
    todo = Todo(
        title="Test",
        description="Description",
        completed=False
    )
    assert todo.title == "Test"
    assert todo.description == "Description"
    assert todo.completed is False
    assert hasattr(todo, 'created_at')
    assert hasattr(todo, 'updated_at')
