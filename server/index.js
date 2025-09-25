const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 채팅 모듈 불러오기
require('./chat')(io);

// 회원가입/로그인 라우터 불러오기
const authRouter = require('./auth');
app.use(cors());
app.use(express.json()); // JSON 파싱 미들웨어
app.use('/auth', authRouter);

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
