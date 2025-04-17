// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ArticleDetail from './pages/ArticleDetail.js';
import CreateArticle from './pages/CreateArticle.js';
import EditArticle from './pages/EditArticle.js';
import AdminDashboard from './pages/AdminDashboard.js';
import PrivateRoute from './components/PrivateRoute.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route 
              path="/create-article" 
              element={
                <PrivateRoute>
                  <CreateArticle />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-article/:id" 
              element={
                <PrivateRoute>
                  <EditArticle />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;