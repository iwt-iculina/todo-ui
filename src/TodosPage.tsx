import React, { useEffect, useState } from "react";
import { Container, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";

interface Todo {
  id: string;
  title: string;
  description: string;
}

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Container className="mt-5">
      <h2>My Todos</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <h5>{todo.title}</h5>
            <p>{todo.description}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default TodosPage;
