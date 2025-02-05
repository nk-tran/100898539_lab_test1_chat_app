document.addEventListener("DOMContentLoaded", function () {
    const socket = io("http://localhost:5000");
    const messageInput = document.getElementById("message");
    const messagesContainer = document.getElementById("messages");
    const roomName = new URLSearchParams(window.location.search).get("room"); 

    document.getElementById("room-name").innerText = roomName;


    socket.emit("joinRoom", roomName);


    socket.on("message", function (data) {
        const messageElement = document.createElement("p");
        messageElement.textContent = `${data.from_user}: ${data.message}`;
        messagesContainer.appendChild(messageElement);
    });


    socket.on("previousMessages", function (messages) {
        messages.forEach(msg => {
            const messageElement = document.createElement("p");
            messageElement.textContent = `${msg.from_user}: ${msg.message}`;
            messagesContainer.appendChild(messageElement);
        });
    });

    // Send a new message
    document.getElementById("sendMessage").addEventListener("click", function () {
        const message = messageInput.value;
        const user = JSON.parse(localStorage.getItem("user")); 
        if (message && user) {
            socket.emit("chatMessage", { room: roomName, message: message, from_user: user.username });
            messageInput.value = "";
        }
    });

    // Leave chat
    document.getElementById("leaveChat").addEventListener("click", () => {
        socket.emit("leaveRoom", roomName);
        window.location.href = "/main"; 
    });
});
