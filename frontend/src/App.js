import React, { useState } from 'react';
import Inbox from './components/Inbox';
import EmailView from './components/EmailView';

function App() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ddd' }}>
        <Inbox onSelect={setSelected} />
      </div>
      <div style={{ flex: 1 }}>
        <EmailView emailId={selected} />
      </div>
    </div>
  );
}

export default App;
