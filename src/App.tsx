import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('chatUsername');
    setIsAuthenticated(!!username);
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/rooms" 
            element={isAuthenticated ? <ChatRooms /> : <Navigate to="/" />} 
          />
          <Route 
            path="/chat/:roomId" 
            element={isAuthenticated ? <ChatRoom /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
