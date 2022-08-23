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
    socket.on("postAComment", async (data) => {
        const user = getUser(data.receiverId);
        const user2 = getUser(data.senderId);
        if (user.socketId == user2.socketId) {
            await io.to(user.socketId).emit("receiveAComment", data);
        } else {
            await io.to(user.socketId).emit("receiveAComment", data);
            await io.to(user2.socketId).emit("receiveAComment", data);
        }
    });vhmn7

    // socket.on("send_message", (data) => {
    //     socket.to(data.room).emit("receive_message", data);
    // });

    socket.on("commentNotification", (data) => {
        const user = getUser(data.receiverId);
        io.to(user.socketId).emit("getCommentNotification", data);
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
