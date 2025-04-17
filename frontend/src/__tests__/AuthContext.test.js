// frontend/src/__tests__/AuthContext.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';

describe('AuthContext', () => {
  test('provides authentication state to consumers', () => {
    const TestComponent = () => {
      const { currentUser, token, login, logout } = React.useContext(AuthContext);
      
      return (
        <div>
          <div data-testid="user">{currentUser ? JSON.stringify(currentUser) : 'no user'}</div>
          <div data-testid="token">{token || 'no token'}</div>
          <button 
            data-testid="login-btn" 
            onClick={() => login('test-token', { username: 'testuser', is_admin: false })}
          >
            Login
          </button>
          <button data-testid="logout-btn" onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state should be logged out
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('token')).toHaveTextContent('no token');

    // Test login
    fireEvent.click(screen.getByTestId('login-btn'));
    expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    expect(screen.getByTestId('token')).toHaveTextContent('test-token');

    // Test logout
    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('token')).toHaveTextContent('no token');
  });
});