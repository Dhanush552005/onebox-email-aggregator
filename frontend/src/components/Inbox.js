import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Inbox({ onSelect }) {
  const [emails, setEmails] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => { fetchEmails(); }, []);
  async function fetchEmails() {
    const r = await axios.get('http://localhost:3000/emails');
    setEmails(r.data || []);
  }
  async function search() {
    const r = await axios.get('http://localhost:3000/emails', { params: { q } });
    setEmails(r.data || []);
  }
  return (
    <div>
      <div style={{ padding: 8 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="search" />
        <button onClick={search}>Search</button>
      </div>
      <ul>
        {emails.map(e => (
          <li key={e.id} style={{ padding: 8, borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => onSelect(e.id)}>
            <div><strong>{e.subject}</strong></div>
            <div style={{ fontSize: 12 }}>{e.from} • {e.category}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
