import http from "http"; // node.js 에 내장된 라이브러리
import express from "express";
import SocketIO from "socket.io";
// import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

console.log("hello");

/**
 * http , ws 동일 포트에 열고 싶을때 이렇게 할 수 있다.
 * http 서버 위에 ws 서버를 올리는 것이다.
 */
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom();
    console.log(roomName);
    socket.to(roomName).emit("welcome");
  });
});

/**
 * ws 로 웹소켓 만들기
 */
/*
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  console.log("Connected to Browser");
  
  socket.on("close", () => {
    console.log("close on");
  });
  
  socket.on("message", (message) => {
    const { type, payload } = JSON.parse(message.toString("utf8"));
    sockets.forEach((aSocket) => {
      switch (type) {
        case "new_message":
          aSocket.send(`${socket["nickname"]}: ${payload}`);
          break;
          case "nickname":
            socket["nickname"] = payload;
            break;
          }
        });
      });
    });
    */

const handleListen = () => console.log("Litening on http://localhost:3000");
httpServer.listen(3000, handleListen);
