import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendAPI from "../../axios";
import "./Registration.css";

const Registration: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await backendAPI.post("/user/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful!");

      navigate("/login", { state: { email } });
    } catch (error) {
      const defaultErrorMessage = "Registration failed!";
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || defaultErrorMessage);
      } else {
        setMessage(defaultErrorMessage);
      }
    }
  };

  return (
    <Container className="mt-5 registration-container">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
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
          Register
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

export default Registration;
