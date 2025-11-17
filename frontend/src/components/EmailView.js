import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmailView({ emailId }) {
  const [email, setEmail] = useState(null);
  useEffect(() => { if (emailId) load(); }, [emailId]);
  async function load() {
    const r = await axios.get(`http://localhost:3000/emails/${emailId}`);
    setEmail(r.data);
  }
  if (!email) return <div style={{ padding: 20 }}>Select an email</div>;
  return (
    <div style={{ padding: 20 }}>
      <h2>{email.subject}</h2>
      <div><strong>From:</strong> {email.from}</div>
      <div><strong>Category:</strong> {email.category}</div>
      <hr />
      <pre style={{ whiteSpace: 'pre-wrap' }}>{email.text}</pre>
    </div>
  );
}
