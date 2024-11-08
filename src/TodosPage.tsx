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
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);

  const fetchTodos = async (page = 1, filter = "", sort = "asc") => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8080/todos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          filter,
          sort,
        },
      });
      console.log(response.data);
      setTodos(response.data.data);
      const totalPages = Math.ceil(response.data.total / response.data.limit);
      setTotalPages(totalPages);
    } catch (error) {
      setError("Failed to load todos. Please try again.");
    }
  };

  useEffect(() => {
    fetchTodos(currentPage, filter, sort);
  }, [currentPage, filter, sort]);

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

  const handleDeleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:8080/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError("Failed to delete todo. Please try again.");
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
      <Form>
        <Form.Group controlId="filter">
          <Form.Label>Filter</Form.Label>
          <Form.Control
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="sort">
          <Form.Label>Sort</Form.Label>
          <Form.Control
            as="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Form.Control>
        </Form.Group>
      </Form>
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
            <Button variant="danger" onClick={() => handleDeleteTodo(todo.id)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="pagination">
        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage}</span>
        <Button
          variant="secondary"
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default TodosPage;
