import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : 'https://cognicxemailai.onrender.com';

function App() {
  const [theme, setTheme] = useState('dark');
  const [text, setText] = useState('');
  const [lang, setLang] = useState('English');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Portuguese', 'Japanese', 'Russian'];

  const normalizePriority = (p) => {
    const s = String(p).toLowerCase();
    if (s.includes('high') || s.includes('hoch') || s.includes('élevé') || s.includes('alta') || s.includes('高')) return 'High';
    if (s.includes('medium') || s.includes('mittel') || s.includes('moyenne') || s.includes('media') || s.includes('中')) return 'Medium';
    return 'Low';
  };

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) { console.error(e); }
  };

  const handleSummarize = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/summarize`, {
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

  const deleteEmail = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/delete/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (e) { console.error("Error deleting:", e); }
  };

  const filteredHistory = history.filter(h => h.category && h.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container">
      <h1>Cognicx Email Intelligence</h1>
      
      <div className="top-bar">
        <button className="theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
        
        <div className="lang-selector">
          <label htmlFor="lang-select">Output Language: </label>
          <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <input className="search-input" placeholder="Search categories..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste email..." />
      <button onClick={handleSummarize} style={{width:'100%', marginTop:'10px', padding:'10px'}}>SUMMARIZE</button>

      {result && (
        <div className={`card priority-${normalizePriority(result.priority)}`} data-lang={lang}>
          <h3>Summary:</h3>
          <p>{result.summary}</p>
          <p><strong>Category:</strong> {result.category} | <strong>Priority:</strong> {result.priority} | <strong>Sentiment:</strong> {result.sentiment}</p>
          <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.summary)}>Copy Summary</button>
        </div>
      )}

      <h3>History:</h3>
      {filteredHistory.map(h => (
        <div 
          key={h.id} 
          className={`card priority-${normalizePriority(h.priority)}`} 
          data-lang={h.language || 'English'}
        >
          <p>
            <strong>Category:</strong> {h.category} | 
            <strong> Priority:</strong> {h.priority} | 
            <strong> Sentiment:</strong> {h.sentiment}
          </p>
          <p>{h.summary}</p>
          <div style={{display:'flex', gap:'10px'}}>
             <button className="copy-btn" onClick={() => navigator.clipboard.writeText(h.summary)}>Copy</button>
             <button className="delete-btn" onClick={() => deleteEmail(h.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default App;