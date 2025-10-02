import { useState, useEffect, useRef, use } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { io } from 'socket.io-client'
import './App.css'

const socket = io("http://localhost:4000"); // 서버 주소  

function ChattingPage() {
    // 채팅앱 구현
    const { state } = useLocation(); // 이전 페이지에서 전달된 상태(state) 가져오기
    const userInfo = state

    const [userCount, setUserCount] = useState();
    const [message, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    const [userList, setUserList] = useState([]);
    const [roomId , setRoomId] = useState("lobby")

    const scrollDownRef = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    useEffect(() => {
        socket.on("userList", (list) => {
            const filteredList = list.filter(u => u.uid != userInfo.uid);
            setUserList(filteredList);
        });

        return () => socket.off("userList");
    }, [userInfo.uid]);



    useEffect(() => {
        socket.emit("chatHistory", roomId); // 채팅 기록 요청

        socket.on("History", (chatHistory) => { // 서버로부터 채팅 기록을 받았을 때
            setMessages(chatHistory);
        });

    }, [])

    useEffect(() => {
        socket.on("message", ({roomId : incomingRoomId,message}) => { // 서버로부터 메시지를 받았을 때
            if(roomId === incomingRoomId)
                setMessages((prev) => [...prev, message]);
        });
        return () => {
            socket.off("message");
        };
    }, [roomId]);

    const sendMessage = () => { // 메시지 전송 함수

        if (input.trim()) {
            socket.emit("message", {roomId : roomId, text: input }); // 서버로 메시지 전송
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
        socket.on("userCount", (data) => setUserCount(data));
        return () => socket.off("userCount");
    }, [])

    useEffect(() => {
        if (userInfo) {
            socket.emit("login", userInfo.username, userInfo.uid);
            console.log("당신의 정보 : ", userInfo);
        }
    }, [userInfo]);

    useEffect(() => {
        socket.on("roomHistory", (data) => {
            console.log(data.roomId, "방의 들어왔습니다.")
            setRoomId(data.roomId)
            setMessages(data.chatHistory);
        })
    }, [])

    const handleUserClick = (targetUid) => {
        console.log("클릭한 유저 UID:", targetUid);
        socket.emit("startDM", targetUid );
        socket.on("getRoomId",(data)=> setRoomId(data))
    };

    return (
        <div className="App">
            <div className='title'>
                <h1>채팅앱</h1>
                <h3>{userCount} 명</h3>

            </div>
            <div style={{ display: "flex", flex: 1, }}>
                {/* 왼쪽 유저 목록 */}
                <div
                    style={{
                        width: "250px",
                        borderRight: "1px solid #ccc",
                        padding: "10px",
                    }}
                >
                    <h3>접속 유저</h3>
                    <ul>
                        {userList.map((user) => (
                            <li key={user.uid}
                                onClick={() => handleUserClick(user.uid)}
                            >{user.username}</li>
                        ))}
                    </ul>
                </div>

                {/* 우측: 채팅 영역 */}
                <div className='chat-box'>
                    {message.map((msg, index) => (
                        <div
                            style={{
                                flex: 1,
                                padding: "10px",
                                overflowY: "auto",
                                background: "#f9f9f9",
                            }}
                            key={index} className="message">
                            <div
                                style={{
                                    textAlign: msg.id === userInfo.uid ? "right" : "left",
                                    backgroundColor: msg.id === userInfo.uid ? "#DCF8C6" : "#f8c6c9ff",
                                    margin: "5px",
                                    padding: "5px",
                                    borderRadius: "5px",
                                }}
                            >
                                <span className="username">{msg.name}</span><br />
                                {msg.text}
                                <span className="timestamp">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollDownRef} />
                </div>
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