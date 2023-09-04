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

function publicRoom() {
  const { sids, rooms } = wsServer.sockets.adapter;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

wsServer.on("connection", (socket) => {
  socket.nickname = "익명";
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
  });
  socket.on("enter_room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom();
    console.log(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    wsServer.sockets.emit("room_change", publicRoom());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
    wsServer.sockets.emit("room_change", publicRoom());
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRoom());
  });

  socket.on("new_message", (message, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });

  socket.on("nickname", (nickname) => {
    socket.nickname = nickname;
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
