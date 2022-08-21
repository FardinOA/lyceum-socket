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
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    // comment
    socket.on("postAComment", (data) => {
        socket.emit("receiveAComment", data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

app.get("/", (req, res) => {
    res.json({ message: "hello Fardin" });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log("SERVER IS RUNNING");
});
