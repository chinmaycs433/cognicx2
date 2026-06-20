import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [text, setText] = useState('');
  const [lang, setLang] = useState('English');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/history');
      if (res.ok) setHistory(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSummarize = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/summarize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text, language: lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      fetchHistory();
    } catch (e) { alert("Backend Error: " + e.message); }
  };

  const filteredHistory = history.filter(h => h.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container">
      <h1>Cognicx Email Intelligence</h1>
      <div className="top-bar">
        <button className="theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option>English</option><option>Hindi</option><option>Spanish</option>
          <option>French</option><option>German</option><option>Arabic</option>
          <option>Chinese</option><option>Portuguese</option><option>Japanese</option>
          <option>Russian</option><option>Italian</option>
        </select>
        <input className="search-input" placeholder="Search categories..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste email..." />
      <button onClick={handleSummarize} style={{width:'100%', marginTop:'10px', padding:'10px'}}>SUMMARIZE</button>

      {result && (
        <div className={`card priority-${result.priority}`}>
          <h3>Analysis:</h3>
          <p><strong>Category:</strong> {result.category} | <strong>Priority:</strong> {result.priority} | <strong>Sentiment:</strong> {result.sentiment}</p>
          <p>{result.summary}</p>
          <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.summary)}>Copy Summary</button>
        </div>
      )}

      <h3>History:</h3>
      {filteredHistory.map(h => (
        <div key={h.id} className={`card priority-${h.priority}`}>
          <p><strong>{h.category}</strong> | <strong>Priority:</strong> {h.priority} | <strong>Sentiment:</strong> {h.sentiment}</p>
          <p>{h.summary}</p>
          <div style={{display:'flex', gap:'10px'}}>
             <button className="copy-btn" onClick={() => navigator.clipboard.writeText(h.summary)}>Copy</button>
             <button className="delete-btn" onClick={() => fetch(`http://127.0.0.1:5000/delete/${h.id}`, {method:'DELETE'}).then(fetchHistory)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default App;