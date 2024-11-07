// Login.tsx
import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        email,
        password,
      });

      localStorage.setItem("jwtToken", response.data.token);
      login();
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      const defaultErrorMessage = "Login failed!";
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || defaultErrorMessage);
      } else {
        setMessage(defaultErrorMessage);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {message && (
        <Alert
          className="mt-3"
          variant={message.includes("successful") ? "success" : "danger"}
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default Login;
