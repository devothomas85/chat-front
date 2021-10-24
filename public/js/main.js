const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

var current_room = "";
var new_room = "";

//Get username and room from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("adduser", { username });

function getValue(clicked_id) {
  var room = this.document.getElementById(clicked_id).innerHTML;

  if (current_room === "") {
    console.log(room);
    current_room = room;
    console.log("current_room" + current_room);
    //JOin Chatroom
    console.log(username, "user+++++++");
    socket.emit("joinroom", { username, room });

    //Get room and Users
    // socket.on("roomUsers", ({ room, users }) => {
    //     outputRoomName(room);
    //     outputUsers(users);
    //   });

    //Message from server
    socket.on("message", (msg) => {
      outputMessage(msg);
      // if(msg){
      //   socket.emit("status", true);
      // }
      //Scrolldown
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    //Message from server
    socket.on("user_message", (msg) => {
      userOutputMessage(msg);

      //Scrolldown
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    //Message from server
    socket.on("status", (stat) => {
      if (!stat.status) {
        $(document).ready(function () {
          console.log("entry done false", stat.status, " ", stat.uuid);
          $(`#check${stat.uuid}`).append(`<i class="fas fa-check"></i>`);
        });
      } else {
        $(document).ready(function () {
          console.log("entry done true : ", stat.status, " ", stat.uuid);

          $(`#check${stat.uuid}`)
            .find("i")
            .removeClass("fa-check")
            .addClass("fa-check-double");
        });
      }

      //outputMessage(msg);

      //Scrolldown
      //chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    //Message Submit
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();

      //Get message text
      const msg = e.target.elements.msg.value;

      //Emit a message to server
      socket.emit("chatMessage", msg);

      //Lear Input
      e.target.elements.msg.value = "";
      e.target.elements.msg.focus();
    });

    function outputMessage(message) {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

      document.querySelector(".chat-messages").appendChild(div);
    }

    function userOutputMessage(message) {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta">${message.message.username} <span>${message.message.time}</span></p>
    <p class="text">
      ${message.message.text}
    </p><div id="check${message.uuid}"></div>`;

      document.querySelector(".chat-messages").appendChild(div);
    }
  } else {
    $( "#chat-messages" ).empty();
    console.log("current room : " + current_room);
    new_room = room;
    console.log("New room : " + new_room);
    //socket.leave('joinroom');
    //JOin Chatroom
    socket.emit("next", {
      currentRoom: current_room,
      newRoom: new_room,
      user: username,
    });
    //$( "#chat-messages" ).load(window.location.href + " #chat-messages" );
    //Get room and Users
    // socket.on("roomUsers", ({ room, users }) => {
    //     outputRoomName(room);
    //     outputUsers(users);
    //   });

    //Message from server
    socket.on("message", (msg) => {
      console.log(msg);
      outputMessage(msg);

      //Scrolldown
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    //Message Submit
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();

      //Get message text
      const msg = e.target.elements.msg.value;

      //Emit a message to server
      socket.emit("chatMessage", msg);

      //Lear Input
      e.target.elements.msg.value = "";
      e.target.elements.msg.focus();
    });

    function outputMessage(message) {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

      document.querySelector(".chat-messages").appendChild(div);
    }
  }
}

//Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
