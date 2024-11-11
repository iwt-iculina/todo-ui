import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppNavbar from "./Navbar";
import Login from "./Login";
import Registration from "./Registration";
import { AuthProvider } from "./AuthContext";
import TodosPage from "./TodosPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-5">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Registration />
                </PublicRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <TodosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TodosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <TodosPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
