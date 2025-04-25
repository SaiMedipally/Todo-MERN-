import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/RegisterPage/RegisterPage';
import NotFound from './components/NotFound/NotFound';
import Login from './components/LoginPage/Login';
import Home from './components/Home/Home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <Register />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route
          path="/home"
          element={<ProtectedRoute><Home /></ProtectedRoute>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
