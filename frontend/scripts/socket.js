const socket = io("http://localhost:5000");

document.getElementById("joinRoomBtn").addEventListener("click", () => {
    const room = document.getElementById("roomName").value;
    socket.emit("joinRoom", room);
});

document.getElementById("sendMessageBtn").addEventListener("click", () => {
    const message = document.getElementById("messageInput").value;
    const room = document.getElementById("roomName").value;

    socket.emit("chatMessage", { room, message });
});

socket.on("message", (data) => {
    console.log("New message:", data);
});
