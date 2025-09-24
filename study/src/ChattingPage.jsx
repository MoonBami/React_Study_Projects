import { useState, useEffect, useRef, use } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { io } from 'socket.io-client'
import './App.css'

const socket = io("http://localhost:4000"); // 서버 주소  

function ChattingPage() {
    // 채팅앱 구현
    const { state } = useLocation(); // 이전 페이지에서 전달된 상태(state) 가져오기
    const username = state.username;

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
        console.log("username:", username);
        socket.emit("chatHistory",null); // 채팅 기록 요청
        console.log("채팅 기록 요청 보냄");

        socket.emit("login",username);

        socket.on("History", (chatHistory) => { // 서버로부터 채팅 기록을 받았을 때
            setMessages(chatHistory);
            console.log("채팅 기록 받음");
        });

    },[])

    useEffect(() => {
        socket.on("connect", () => { // 서버에 접속했을 때
            setMyId(socket.id); // 내 소켓 id 저장
        })


        socket.on("message", (data) => { // 서버로부터 메시지를 받았을 때
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => { // 메시지 전송 함수

        if (input.trim()) {
            socket.emit("message", { text: input, id: myId,name:username }); // 서버로 메시지 전송
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
                                backgroundColor: msg.id === myId ? "#DCF8C6" : "#f8c6c9ff",
                                margin: "5px",
                                padding: "5px",
                                borderRadius: "5px",
                            }}
                        >
                            <span className='username'>{msg.name}</span><br />
                            {msg.text}
                            <span className='timestamp'>{msg.time}</span>
                        </div>
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

export default ChattingPage;