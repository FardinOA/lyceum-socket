const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
app.use(
    cors({
        origin: [
            "https://lyceum-frontend-git-main-fardinoa.vercel.app",
            "https://lyceum-frontend.vercel.app",
            "https://lyceum-frontend-fardinoa.vercel.app",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "https://lyceum-frontend-git-main-fardinoa.vercel.app",
            "https://lyceum-frontend.vercel.app",
            "https://lyceum-frontend-fardinoa.vercel.app",
            "http://localhost:3000",
        ],
        metods: ["GET", "POST"],
        credentials: true,
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("userConnected");

    socket.on("addUser", (userId) => {
        console.log(userId);
        addUser(userId, socket.id);
    });
    // comment
    socket.on("postAComment", (data) => {
        const user = getUser(data.receiverId);
        const user2 = getUser(data.senderId);

        if (data.receiverId === data.senderId) {
            io.to(user.socketId).emit("receiveAComment", data);
        } else {
            if (user2) {
                io.to(user2.socketId).emit("receiveAComment", data);
            }

            if (user) {
                io.to(user.socketId).emit("receiveAComment", data);
            }
        }
    });

    // socket.on("send_message", (data) => {
    //     socket.to(data.room).emit("receive_message", data);
    // });

    socket.on("commentNotification", (data) => {
        const user = getUser(data.receiverId);
        if (user) io.to(user.socketId).emit("getCommentNotification", data);
    });

    socket.on(
        "sendMessage",
        ({ senderId, receiverId, text, messageSender }) => {
            const user = getUser(receiverId);

            io.to(user.socketId).emit("getMessage", {
                messageSender,
                senderId,
                text,
                receiverId,
            });
        }
    );
    io.emit("getActiveUsers", {
        activeUsers: users,
    });
    socket.on("disconnect", () => {
        console.log("disconnected");
        removeUser(socket.id);
    });
});

app.get("/", (req, res) => {
    res.json({ message: "hello Fardin" });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log("SERVER IS RUNNING");
});
