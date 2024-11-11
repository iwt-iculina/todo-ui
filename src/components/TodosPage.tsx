import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  ListGroup,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import TodoForm from "./TodoForm";
import backendAPI from "../axios";
import "./App.css";

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
      const response = await backendAPI.get("/todos/", {
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
      await backendAPI.post("/todos/", {
        title: newTitle,
        description: newDescription,
      });

      setNewTitle("");
      setNewDescription("");
      setShowModal(false);

      fetchTodos(currentPage, filter, sort);
    } catch (error) {
      setError("Failed to create todo. Please try again.");
    }
  };

  const handleEditTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await backendAPI.put(`/todos/${currentTodo?.id}`, {
        title: editTitle,
        description: editDescription,
      });
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
      await backendAPI.delete(`/todos/${id}`);
      fetchTodos(currentPage, filter, sort);
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
    <Container className="narrow-container">
      <h1>Todos</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Add
      </Button>
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Group controlId="filter">
              <Form.Label>Filter</Form.Label>
              <Form.Control
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Enter title"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
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
          </Col>
        </Row>
      </Form>
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
            buttonText="Create"
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
            buttonText="Save"
          />
        </Modal.Body>
      </Modal>
      <ListGroup className="mb-3">
        {todos.map((todo) => (
          <ListGroup.Item
            key={todo.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{todo.title}</h5>
              <p>{todo.description}</p>
            </div>
            <div className="ml-auto">
              <Button variant="link" onClick={() => openEditModal(todo)}>
                <FaEdit size={20} />
              </Button>
              <Button variant="link" onClick={() => handleDeleteTodo(todo.id)}>
                <FaTrash size={20} />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="pagination d-flex align-items-center justify-content-center mt-3 mb-3">
        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="me-3"
        >
          Previous
        </Button>
        <span className="px-3">
          {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
          className="ms-3"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default TodosPage;
