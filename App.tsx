import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { ChatApp } from './components/ChatApp';

function App() {
  // This state is NOT saved to localStorage, so it resets to false on every refresh/close
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleLock = () => {
    setIsUnlocked(false);
  };

  if (!isUnlocked) {
    return <Calculator onUnlock={() => setIsUnlocked(true)} />;
  }

  return <ChatApp onLock={handleLock} />;
}

export default App;