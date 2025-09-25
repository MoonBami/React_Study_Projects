import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("login"); // login 또는 register
  const navigate = useNavigate();

  const API_URL = "http://localhost:4000/auth";

  const handleLogin = async () => {
    if (!username) return alert("아이디를 입력하세요!");
    try {
      const res = await axios.post(`${API_URL}/login`, { username }); // 
      alert("로그인 성공!");
      navigate("/chat", { state: { username } });
    } catch (err) {
      alert(err.response?.data?.message || "로그인 요청 실패");
    }
  };

  const handleRegister = async () => {
    if (!username) return alert("아이디를 입력하세요!");
    try {
      const res = await axios.post(`${API_URL}/register`, { username });
      alert("회원가입 성공! 로그인 해주세요.");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 요청 실패");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>

      <input
        type="text"
        placeholder="아이디 입력"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", margin: "10px auto" }}
      />

      {mode === "login" ? (
        <button onClick={handleLogin}>로그인</button>
      ) : (
        <button onClick={handleRegister}>회원가입</button>
      )}

      <div style={{ marginTop: "20px" }}>
        {mode === "login" ? (
          <p>
            계정이 없으신가요?{" "}
            <button onClick={() => setMode("register")}>회원가입</button>
          </p>
        ) : (
          <p>
            이미 계정이 있으신가요?{" "}
            <button onClick={() => setMode("login")}>로그인</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;