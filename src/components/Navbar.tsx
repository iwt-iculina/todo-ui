import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { FaUser } from "react-icons/fa";

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let email = "";

  if (isLoggedIn) {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      const decoded: any = jwtDecode(jwtToken);
      email = decoded.email || "";
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/todos">
        TODO APP
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {isLoggedIn ? (
          <>
            <Nav>
              <Nav.Link as={Link} to="/todos">
                Todos
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} id="profile-dropdown">
                  <FaUser />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.ItemText>{email}</Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </>
        ) : (
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
