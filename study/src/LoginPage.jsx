import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client'

const socket = io("http://localhost:4000"); // 서버 주소  

function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() === "") return alert("닉네임을 입력하세요!");
    // 로그인 성공했다고 가정 → 채팅 페이지로 이동하면서 이름 넘김
    navigate("/chat", { state: { username } });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="닉네임 입력"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>입장하기</button>
    </div>
  );
}

export default LoginPage;