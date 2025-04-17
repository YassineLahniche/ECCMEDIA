// frontend/src/pages/CreateArticle.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { articleService } from '../services/api';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { title, content } = formData;
      const newArticle = await articleService.create({ title, content });
      navigate(`/articles/${newArticle.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px' }}>
      <h2 style={{ color: '#00325A', marginBottom: '2rem' }}>Write New Article</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            value={formData.content}
            onChange={handleChange}
            required
            rows="15"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;