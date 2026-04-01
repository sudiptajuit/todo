def test_read_root(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_create_todo(client):
    """Test creating a todo via API"""
    response = client.post(
        "/api/todos",
        json={
            "title": "API Test Todo",
            "description": "Test description",
            "completed": False
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "API Test Todo"
    assert data["description"] == "Test description"
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data

def test_get_todos(client):
    """Test getting all todos"""
    # Create a todo first
    client.post(
        "/api/todos",
        json={"title": "Todo 1"}
    )

    response = client.get("/api/todos")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_get_todo_by_id(client):
    """Test getting a specific todo"""
    # Create a todo
    create_response = client.post(
        "/api/todos",
        json={"title": "Specific Todo"}
    )
    todo_id = create_response.json()["id"]

    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json()["id"] == todo_id
    assert response.json()["title"] == "Specific Todo"

def test_update_todo(client):
    """Test updating a todo"""
    # Create a todo
    create_response = client.post(
        "/api/todos",
        json={"title": "Original Title"}
    )
    todo_id = create_response.json()["id"]

    response = client.put(
        f"/api/todos/{todo_id}",
        json={
            "title": "Updated Title",
            "completed": True
        }
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"
    assert response.json()["completed"] is True

def test_delete_todo(client):
    """Test deleting a todo"""
    # Create a todo
    create_response = client.post(
        "/api/todos",
        json={"title": "To Delete"}
    )
    todo_id = create_response.json()["id"]

    response = client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 204

    # Verify deletion
    get_response = client.get(f"/api/todos/{todo_id}")
    assert get_response.status_code == 404

def test_create_todo_invalid_data(client):
    """Test creating a todo with invalid data"""
    response = client.post(
        "/api/todos",
        json={
            "title": "",  # Empty title should fail
            "completed": False
        }
    )
    assert response.status_code == 422  # Validation error

def test_get_nonexistent_todo(client):
    """Test getting a todo that doesn't exist"""
    response = client.get("/api/todos/9999")
    assert response.status_code == 404
