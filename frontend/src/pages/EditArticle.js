// frontend/src/pages/EditArticle.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { articleService } from '../services/api';

const EditArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleService.get(parseInt(id));
        setFormData({
          title: data.title,
          content: data.content,
        });
        
        // Check if current user is author or admin
        if (!(currentUser.is_admin || currentUser.username === data.author)) {
          navigate('/');
        }
      } catch (err) {
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { title, content } = formData;
      await articleService.update(parseInt(id), { title, content });
      navigate(`/articles/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading article...</div>;
  }

  return (
    <div className="form-container" style={{ maxWidth: '800px' }}>
      <h2 style={{ color: '#00325A', marginBottom: '2rem' }}>Edit Article</h2>
      
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
        
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditArticle;