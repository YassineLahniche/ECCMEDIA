// frontend/src/pages/ArticleDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { articleService } from '../services/api';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleService.get(parseInt(id));
        setArticle(data);
      } catch (err) {
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.delete(article.id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete article');
      }
    }
  };

  if (loading) {
    return <div>Loading article...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  // Check if current user is author or admin
  const canEdit = currentUser && 
    (currentUser.is_admin || currentUser.username === article.author);

  return (
    <div className="article-detail">
      <h2>{article.title}</h2>
      
      <div className="meta">
        By {article.author} • {new Date(article.created_at).toLocaleDateString()}
      </div>
      
      <div className="content" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} style={{ marginBottom: '1rem' }}>{paragraph}</p>
        ))}
      </div>
      
      {canEdit && (
        <div className="actions" style={{ marginTop: '2rem' }}>
          <Link to={`/edit-article/${article.id}`} className="btn">
            Edit Article
          </Link>
          <button 
            onClick={handleDelete} 
            className="btn" 
            style={{ marginLeft: '1rem', backgroundColor: '#d32f2f' }}
          >
            Delete Article
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/" className="btn" style={{ backgroundColor: '#3A46B' }}>
          Back to Articles
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetail;