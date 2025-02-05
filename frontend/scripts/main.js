function logout() {

    localStorage.removeItem("user");


    window.location.href = '/';
}

document.addEventListener("DOMContentLoaded", function() {
  const socket = io("http://localhost:5000"); 
  const roomListContainer = document.getElementById("room-list");


  const predefinedRooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];

  // Function to dynamically create a room button
  function addRoomButton(roomName) {
      const roomButton = document.createElement("button");
      roomButton.innerText = roomName;
      roomButton.onclick = function() {
          // Join the selected room
          socket.emit("joinRoom", roomName);
          window.location.href = "/chat?room=" + roomName; 
      };
      roomListContainer.appendChild(roomButton);
  }

  // Populate room list with predefined rooms
  predefinedRooms.forEach(room => {
      addRoomButton(room);
  });

  socket.on("disconnect", function() {
      console.log("Disconnected from server");
  });


});
