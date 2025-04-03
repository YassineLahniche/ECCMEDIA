import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/articles')
            .then(response => response.json())
            .then(data => setArticles(data));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>ECC Media</h1>
                <p>Laboratoire journalistique étudiant</p>
            </header>
            <main>
                <h2>Articles récents</h2>
                {articles.map(article => (
                    <article key={article.id}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <small>Par {article.author}</small>
                    </article>
                ))}
            </main>
        </div>
    );
}

export default App;