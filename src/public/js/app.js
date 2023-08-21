const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to server");
});

socket.addEventListener("message", (message) => {
  console.log("New Message :" + message.data);

  console.log(message);
});

socket.addEventListener("close", () => {
  console.log("close event");
});

// 5초 뒤 서버로 메시지 보내기
setTimeout(() => {
  socket.send("안녕 나는 브라우저야");
}, 5000);

function handleSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
