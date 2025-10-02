const moment = require("moment");

let chatHistory = [];
let usercount = 0;

let users = {};
let rooms = {
    "lobby": {   // 기본 방
        users: [],
        chatHistory: []
    }
};

module.exports = (io) => {
    io.on("connection", (socket) => {
        usercount++;

        socket.on("login", (username, uid, roomId) => {
            console.log(`${username} 로그인`);
            socket.username = username;
            socket.uid = uid;
            users[uid] = { username, socketId: socket.id };

            // 클라이언트에서 roomId를 안 보냈으면 기본 방으로 지정
            if (!roomId) roomId = "lobby";

            // 방이 존재하지 않으면 생성
            if (!rooms[roomId]) {
                rooms[roomId] = { users: [], chatHistory: [] };
            }

            rooms[roomId].users.push(uid);   // 방에 유저 추가
            socket.join(roomId);

            // 나를 제외한 모든 유저에게 실시간 갱신
            const updatedList = Object.entries(users)
                .map(([id, u]) => ({ uid: id, username: u.username }));

            io.emit("userList", updatedList);
        });

        // DM 시작
        socket.on("startDM", (targetUid) => {
            const roomId = `dm-${[socket.uid, targetUid].sort().join("-")}`;

            if (!rooms[roomId]) {
                rooms[roomId] = { users: [socket.uid, targetUid], chatHistory: [] };
            }

            socket.join(roomId);
            socket.emit("roomHistory", { roomId, chatHistory: rooms[roomId].chatHistory });
        });

        io.emit("userCount", usercount);

        // 전체 채팅 기록 요청
        socket.on("chatHistory", (data) => {
            console.log("채팅 기록 요청");
            socket.emit("History", rooms[data].chatHistory);
        });

        // 메시지 보내기
        socket.on("message", (data) => {
            const timestamp = moment().format("h:mm A");
            const message = {
                text: data.text,
                name: socket.username,
                time: timestamp,
                id: socket.uid,
            };
            if (rooms[data.roomId]) {
                rooms[data.roomId].chatHistory.push(message);
                console.log(rooms[data.roomId])
                io.to(data.roomId).emit("message", { roomId: data.roomId, message });
            } else {
                console.log(`방 ${data.roomId} 없음`);
            }
        });

        // 유저 접속 종료
        socket.on("disconnect", () => {
            usercount--;
            console.log(`${socket.username} 접속 해제`);
            io.emit("userCount", usercount);

            // 유저 삭제
            delete users[socket.uid];

            // 모든 방에서 제거
            for (const roomId in rooms) {
                rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.uid);
            }

            // 업데이트된 유저 목록 전송
            const updatedList = Object.entries(users)
                .map(([id, u]) => ({ uid: id, username: u.username }));
            io.emit("userList", updatedList);
        });
    });
};