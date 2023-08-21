import http from "http"; // node.js 에 내장된 라이브러리
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

console.log("hello");

const handleListen = () => console.log("Litening on http://localhost:3000");

/**
 * http , ws 동일 포트에 열고 싶을때 이렇게 할 수 있다.
 * http 서버 위에 ws 서버를 올리는 것이다.
 */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser");

  socket.on("close", () => {
    console.log("close on");
  });

  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString("utf8")));
  });
});

server.listen(3000, handleListen);
