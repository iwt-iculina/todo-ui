import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  ListGroup,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import TodoForm from "./TodoForm";

interface Todo {
  id: string;
  title: string;
  description: string;
}

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:8080/todos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data.data);
      } catch (error) {
        setError("Failed to load todos. Please try again.");
      }
    };

    fetchTodos();
  }, []);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:8080/todos/",
        {
          title: newTitle,
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos([...todos, response.data]);
      setNewTitle("");
      setNewDescription("");
      setShowModal(false);
    } catch (error) {
      setError("Failed to create todo. Please try again.");
    }
  };

  const handleEditTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `http://localhost:8080/todos/${currentTodo?.id}`,
        {
          title: editTitle,
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === currentTodo?.id ? response.data : todo
        )
      );
      setShowEditModal(false);
    } catch (error) {
      setError("Failed to edit todo. Please try again.");
    }
  };

  const openEditModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setShowEditModal(true);
  };

  return (
    <Container>
      <h1>Todos</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TodoForm
            title={newTitle}
            description={newDescription}
            setTitle={setNewTitle}
            setDescription={setNewDescription}
            handleSubmit={handleCreateTodo}
            buttonText="Create Todo"
          />
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TodoForm
            title={editTitle}
            description={editDescription}
            setTitle={setEditTitle}
            setDescription={setEditDescription}
            handleSubmit={handleEditTodo}
            buttonText="Save Changes"
          />
        </Modal.Body>
      </Modal>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <h5>{todo.title}</h5>
            <p>{todo.description}</p>
            <Button variant="secondary" onClick={() => openEditModal(todo)}>
              Edit
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default TodosPage;
