// frontend/src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll();
        setArticles(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2 style={{ color: '#00325A', marginBottom: '2rem' }}>Latest Articles</h2>
      
      {articles.length === 0 ? (
        <p>No articles found. Be the first to publish!</p>
      ) : (
        <div className="articles-container">
          {articles.map((article) => (
            <article key={article.id}>
              <h3>{article.title}</h3>
              <div className="meta">
                By {article.author} • {new Date(article.created_at).toLocaleDateString()}
              </div>
              <div className="content">
                {article.content.length > 150
                  ? `${article.content.substring(0, 150)}...`
                  : article.content}
              </div>
              <div className="actions">
                <Link to={`/articles/${article.id}`} className="btn">
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;