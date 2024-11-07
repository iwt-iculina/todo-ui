import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppNavbar from "./Navbar";
import Login from "./Login";
import Registration from "./Registration";
import { AuthProvider } from "./AuthContext";

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("jwtToken");

  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
