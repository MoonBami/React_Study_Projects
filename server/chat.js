const moment = require("moment");

let chatHistory = [];
let usercount = 0;

module.exports = (io) => {
    io.on("connection", (socket) => {
        usercount++;
        console.log(`사용자 접속 (총 ${usercount}명)`);

        socket.on("login", (username, uid) => {
            console.log(`${username} 로그인`);
            socket.username = username;
            socket.uid = uid;
        });

        socket.on("chatHistory", () => {
            console.log("채팅 기록 요청");
            socket.emit("History", chatHistory);
        });

        socket.on("message", (data) => {
            const timestamp = moment().format("h:mm A");
            const message = {
                text: data.text,
                name: socket.username,
                time: timestamp,
                id: socket.uid,
            };

            chatHistory.push(message);
            if (chatHistory.length > 100) chatHistory.shift();

            io.emit("message", message);
        });

        socket.on("disconnect", () => {
            usercount--;
            console.log(`${socket.username} 접속 해제`);
        });
    });
};
