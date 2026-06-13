import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

interface CrimeRow {
  id: string;
  crime_type: string;
  title: string;
  source_url: string;
  incident_date: string;
}

export function AdminCrimesManager() {
  const [crimes, setCrimes] = useState<CrimeRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [type, setType] = useState('Rape');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchCrimes = async () => {
    try {
      const types = ['Rape', 'Murder', 'Kidnapping', 'Robbery', 'Extortion'];
      let allCrimes: CrimeRow[] = [];
      
      for (const cat of types) {
        const res = await fetch(`/api/v1/crimes?type=${cat}`);
        if (res.ok) {
          const data = await res.json();
          allCrimes = [...allCrimes, ...data];
        }
      }
      
      // Sort all newest first
      allCrimes.sort((a, b) => new Date(b.incident_date).getTime() - new Date(a.incident_date).getTime());
      setCrimes(allCrimes);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this citation?')) return;
    try {
      const res = await fetch(`/api/v1/crimes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCrimes();
    } catch {
      // Network error
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !date) return alert('Fill all fields');
    
    try {
      const res = await fetch('/api/v1/crimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crime_type: type,
          title,
          source_url: url,
          incident_date: date
        })
      });
      if (res.ok) {
        setTitle('');
        setUrl('');
        fetchCrimes();
      } else {
        alert('Failed to add');
      }
    } catch {
      // Network error
    }
  };

  return (
    <div className="admin-crimes-container">
      <div className="admin-crimes-header">
        <ShieldCheck size={24} color="#10b981" />
        <h2 className="admin-crimes-title">Verified Crime Citations Manager</h2>
      </div>

      <form onSubmit={handleAdd} className="admin-crimes-form">
        <select value={type} onChange={e => setType(e.target.value)} className="admin-crimes-input">
          <option value="Rape">Rape</option>
          <option value="Murder">Murder</option>
          <option value="Kidnapping">Kidnapping</option>
          <option value="Robbery">Robbery</option>
          <option value="Extortion">Extortion</option>
        </select>
        
        <input 
          type="text" 
          placeholder="News Article Headline" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="admin-crimes-input flex-1"
        />
        
        <input 
          type="url" 
          placeholder="https://..." 
          value={url} 
          onChange={e => setUrl(e.target.value)}
          className="admin-crimes-input flex-1"
        />
        
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)}
          className="admin-crimes-input"
        />
        
        <button type="submit" className="admin-crimes-btn">
          <Plus size={16} /> Add Verified Record
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-crimes-table-wrapper">
          <table className="admin-crimes-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Headline</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crimes.map(c => (
                <tr key={c.id}>
                  <td className="text-muted">{c.crime_type}</td>
                  <td>
                    <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="admin-crimes-link">
                      {c.title} <ExternalLink size={12} color="#666" />
                    </a>
                  </td>
                  <td className="text-muted">
                    {new Date(c.incident_date).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="admin-crimes-delete-btn"
                      title="Delete false positive"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {crimes.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-crimes-empty">No verified records found. Run sync or add manually.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
