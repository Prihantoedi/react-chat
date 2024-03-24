import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  
  return (
    
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={<Home socket={socket} />}></Route>  
          <Route exact path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>  
      </div>  
    </BrowserRouter> 
    
  );
}

export default App;
