import { useState, useEffect, useRef, use } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios'
import './App.css'

function App() {
  // 채팅앱 구현
  const [message, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [yourInput, setYourInput] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const myId = 123;
  const yourId = 456;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])



  return (
    <div className="App">
      <div className='title'>
        <h1>채팅앱</h1>
      </div>
      <div className='chat-box'>
        {message.map((msg, index) => (
          <div key={index} className='message'>
            {msg.id == myId ? <span className='myChat'>{msg.text}</span> : <span className='yourChat'>{msg.text}</span>}
            <span className='timestamp'>{new Date().toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className='input-box'>
        <footer className='my-message'>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const newMessage = {
                id: myId,
                text: input,
                timestamp: new Date().toLocaleTimeString()
              }
              setMessages([...message, newMessage]);
              setInput("");
            }
          }}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={() => {
          const newMessage = {
                id: myId,
                text: input,
                timestamp: new Date().toLocaleTimeString()
              }
              setMessages([...message, newMessage]);
              setInput("");
        }}>전송</button>
        </footer>
        <footer className='your-message'>
        <input
          type="text"
          value={yourInput}
          onChange={(e) => setYourInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const newMessage = {
                id: yourId,
                text: yourInput,
                timestamp: new Date().toLocaleTimeString()
              }
              setMessages([...message, newMessage]);
              setYourInput("");
            }
          }}
          placeholder="상대방의 메시지를 입력하세요"
        />
        <button onClick={() => {
          const newMessage = {
                id: yourId,
                text: yourInput,
                timestamp: new Date().toLocaleTimeString()
              }
              setMessages([...message, newMessage]);
              setYourInput("");
        }}>전송</button>
        </footer>
      </div>
    </div>
  )
}


export default App
