const socket = io();

const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");

room.hidden = true;

const form = document.querySelector("form");

let roomName = "";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = "message";
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `방: ${roomName}`;
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  console.log("누군가가 들어왔습니다.");
  addMessage("누군가가 들어왔습니다!");
});
