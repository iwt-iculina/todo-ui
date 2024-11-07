import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppNavbar from "./Navbar";
import Login from "./Login";
import Registration from "./Registration";
import { AuthProvider } from "./AuthContext";
import TodosPage from "./TodosPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/todos" element={<TodosPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
