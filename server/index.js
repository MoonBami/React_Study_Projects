const express = require('express');// express 모듈 불러오기
const http = require('http'); // http 모듈 불러오기
const app = express();  // express 객체 생성
const path = require('path'); // path 모듈 불러오기
const server = http.createServer(app); // http 서버 생성

const socketIo = require('socket.io'); // socket.io 모듈 불러오기
const io = socketIo(server,{
    cors: {
        origin: "http://localhost:5173", // 클라이언트 주소
        methods: ["GET", "POST"] // 허용할 HTTP 메서드
    }
}) // socket.io 서버 생성

const moment = require("moment"); // moment 모듈 불러오기

io.on("connection", (socket) => { // 클라이언트가 접속했을 때

    console.log(`유저가 접속했습니다 : ${socket.id}`); // 접속한 클라이언트의 id 출력

    socket.on("message", (data) => { // 클라이언트가 메시지를 보냈을 때
        const timestamp = moment().format("h:mm A"); // 현재시간
        const message = { ...data, timestamp }; // 메시지에 현재시간 추가
        io.emit("message", message); // 모든 클라이언트에게 메시지 전송
    });

    socket.on("disconnect", () => { // 클라이언트가 접속을 종료했을 때
        console.log(`유저가 접속 종료했습니다 : ${socket.id}`); // 접속 종료한 클라이언트의 id 출력
    });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
