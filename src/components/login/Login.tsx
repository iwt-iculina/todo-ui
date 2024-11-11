import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import backendAPI from "../../axios";
import CustomToast from "../CustomToast";
import "./Login.css";

const Login: React.FC = () => {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    const loggedOut = "loggedOut";
    if (sessionStorage.getItem(loggedOut)) {
      setShowLogoutToast(true);
      sessionStorage.removeItem(loggedOut);
    }
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await backendAPI.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("jwtToken", response.data.token);
      login();

      navigate("/todos");
    } catch (error) {
      const defaultErrorMessage = "Wrong credentials!";
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || defaultErrorMessage);
      } else {
        setMessage(defaultErrorMessage);
      }
    }
  };

  return (
    <Container className="login-container">
      {showLogoutToast && (
        <CustomToast message="You have been logged out." duration={3000} />
      )}
      <h2>Login</h2>
      <Form onSubmit={handleLogin} className="mb-3">
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
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </Container>
  );
};

export default Login;
