import { useState, useEffect, useRef, use } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios'
import {io} from 'socket.io-client'
import './App.css'

const socket = io("http://localhost:4000"); // 서버 주소  

function App() {
  // 채팅앱 구현
  const [message, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])

  useEffect(() => {
    socket.on("connect", () => { // 서버에 접속했을 때
      setMyId(socket.id);
    })


    socket.on("message", (data) => { // 서버로부터 메시지를 받았을 때
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => { // 메시지 전송 함수
    
    if (input.trim()){
      socket.emit("message", {text: input,id: myId}); // 서버로 메시지 전송
      setInput("");
    }

  }
  
  useEffect(() => {
  if (myId) {
    console.log("업데이트된 myId:", myId);
  }
}, [myId]);


  return (
    <div className="App">
      <div className='title'>
        <h1>채팅앱</h1>
      </div>
      <div className='chat-box'>
        {message.map((msg, index) => (
          <div key={index} className='message'>
            <div
            key={index}
            style={{
              textAlign: msg.id === myId ? "right" : "left",
              backgroundColor: msg.id === myId ? "#DCF8C6" : "#FFF",
              margin: "5px",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {msg.text}
          </div>
            <span className='timestamp'>{msg.timestamp}</span>
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
                if (input.trim() === "") return;
                sendMessage();
              }
            }}
            placeholder="메시지를 입력하세요"
          />
          <button onClick={() => {
            if (input.trim() === "") return;
            sendMessage();
          }}>전송</button>
        </footer>
      </div>
    </div>
  )
}


export default App
