// frontend/src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="App-header">
      <h1>
        <Link to="/" style={{ color: '#FAF9F6', textDecoration: 'none' }}>
          ECC Media
        </Link>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Articles</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link to="/create-article">Write Article</Link>
              </li>
              {currentUser.is_admin && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <a href="#" onClick={handleLogout}>Logout</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;