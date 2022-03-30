$(function () {
  let socket = io.connect("http://localhost:3000");

  let message = $("#message");
  let send_message = $("#send_message");
  let chatroom = $("#chatroom");
  let feedback = $("#feedback");
  let usersList = $("#users-list");
  let nickName = $("#nickname-input");

  send_message.click(function () {
    socket.emit("new_message", { message: message.val() });
  });

  message.keypress((e) => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if (keycode == "13") {
      socket.emit("new_message", { message: message.val() });
    }
  });

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");

    chatroom.append(`
                        <div>
                            <div class="box3 sb14">
                              <p style='color:${data.color}' class="chat-text user-nickname">${data.username}</p>
                              <p class="chat-text" style="color: rgba(0,0,0,0.87)">${data.message}</p>
                            </div>
                        </div>
                        `);
    keepTheChatRoomToTheBottom();
  });

  nickName.keypress((e) => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if (keycode == "13") {
      socket.emit("change_username", { nickName: nickName.val() });
      socket.on("get users", (data) => {
        let html = "";
        for (let i = 0; i < data.length; i++) {
          html += `<li class="list-item" style="color: ${data[i].color}">${data[i].username}</li>`;
        }
        usersList.html(html);
      });
    }
  });

  message.on("keypress", (e) => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if (keycode != "13") {
      socket.emit("typing");
    }
  });

  socket.on("typing", (data) => {
    feedback.html(
      "<p><i>" + data.username + " is typing a message..." + "</i></p>"
    );
  });
});

const keepTheChatRoomToTheBottom = () => {
  const chatroom = document.getElementById("chatroom");
  chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
};
