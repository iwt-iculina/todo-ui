import React from "react";
import { Form, Button } from "react-bootstrap";

interface TodoFormProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  buttonText: string;
}

const TodoForm: React.FC<TodoFormProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  handleSubmit,
  buttonText,
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default TodoForm;
