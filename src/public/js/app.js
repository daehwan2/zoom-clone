const socket = io();

const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");

room.hidden = true;

const form = document.querySelector("form");

let roomName = "";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleNickNameSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#nickName input");
  socket.emit("nickname", input.value);
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#message input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`나: ${input.value}`);
    input.value = "";
  });
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `방: ${roomName}`;

  const msgForm = room.querySelector("#message ");
  const nameForm = room.querySelector("#nickName ");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `방: ${roomName}, 인원: ${newCount}`;
  addMessage(`${nickname}(이)가 들어왔습니다!`);
});

socket.on("bye", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `방: ${roomName}, 인원: ${newCount}`;
  addMessage(`${nickname}(이)가 떠났습니다 🥲`);
});

socket.on("new_message", (message) => {
  addMessage(message);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
