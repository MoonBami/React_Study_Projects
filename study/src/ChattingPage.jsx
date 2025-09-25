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
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    const scrollDownRef = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/auth/${username}`);
                setUserInfo(res.data);
            } catch (err) {
                console.error(err);
                alert("내 정보 요청 실패");
            }
        };
        fetchUserInfo();
    },[username]);

    useEffect(() => {
        socket.emit("chatHistory",null); // 채팅 기록 요청

        socket.on("History", (chatHistory) => { // 서버로부터 채팅 기록을 받았을 때
            setMessages(chatHistory);
        });

    },[])

    useEffect(() => {
        socket.on("message", (data) => { // 서버로부터 메시지를 받았을 때
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => { // 메시지 전송 함수

        if (input.trim()) {
            socket.emit("message", { text: input}); // 서버로 메시지 전송
            setInput("");
        }

    }
    useEffect(() => {
        scrollToBottom();
    }, [message]);

    const scrollToBottom = () => {
        if (scrollDownRef.current) {
            scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (userInfo) {
            socket.emit("login", userInfo.username, userInfo.uid);
            console.log("당신의 정보 : ",userInfo);
        }
    },[userInfo]);

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
                                textAlign: msg.id === userInfo.uid ? "right" : "left",
                                backgroundColor: msg.id === userInfo.uid ? "#DCF8C6" : "#f8c6c9ff",
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
                <div ref={scrollDownRef} />
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