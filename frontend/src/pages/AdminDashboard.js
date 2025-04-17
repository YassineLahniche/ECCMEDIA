// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, articleService } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, articlesData] = await Promise.all([
          userService.getAll(),
          articleService.getAll()
        ]);
        
        setUsers(usersData);
        setArticles(articlesData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2 style={{ color: '#00325A', marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div className="dashboard-section">
        <h3 style={{ color: '#193331', borderBottom: '2px solid #CF9D04', paddingBottom: '0.5rem' }}>
          Users ({users.length})
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#00325A', color: '#FAF9F6' }}>
              <th style={tableHeaderStyle}>Username</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{user.username}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.is_admin ? 'Admin' : 'Writer'}</td>
                <td style={tableCellStyle}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="dashboard-section" style={{ marginTop: '3rem' }}>
        <h3 style={{ color: '#193331', borderBottom: '2px solid #CF9D04', paddingBottom: '0.5rem' }}>
          Articles ({articles.length})
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#00325A', color: '#FAF9F6' }}>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>Author</th>
              <th style={tableHeaderStyle}>Created</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{article.title}</td>
                <td style={tableCellStyle}>{article.author}</td>
                <td style={tableCellStyle}>
                  {new Date(article.created_at).toLocaleDateString()}
                </td>
                <td style={tableCellStyle}>
                  <Link 
                    to={`/articles/${article.id}`} 
                    style={{ color: '#00325A', marginRight: '1rem' }}
                  >
                    View
                  </Link>
                  <Link 
                    to={`/edit-article/${article.id}`} 
                    style={{ color: '#193331' }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for table
const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left'
};

const tableRowStyle = {
  borderBottom: '1px solid #eee'
};

const tableCellStyle = {
  padding: '0.75rem'
};

export default AdminDashboard;