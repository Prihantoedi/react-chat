import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
import Home from './pages/home';
import ChatPage from './components/ChatPage';
import Chat from './pages/chat';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function App() {
  
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path="/" 
            element={
            <Home
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
             />
             }
            >
          </Route>

          <Route exact path="/chat"
            element={<Chat username={username} room={room} socket={socket} />}
          >
          
          </Route>  
        
        </Routes>  
      </div>  
    </Router> 
    
  );
}

export default App;
