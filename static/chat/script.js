const socket = io();
const form = document.querySelector('form');

for (let i = 0; i <= 9; i++) {
    let a = "2";
    a <<= i;
    console.log(a);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    let inputText = document.querySelector('input[type="text"]');
    if (inputText.value) {
        socket.emit('new_message', inputText.value);
        inputText.value = "";
    }
});

let userNickname = prompt("enter your nickname");
while (userNickname === "") {
    userNickname = prompt("enter your nickname");
}
socket.emit("changeNickname", userNickname);

let messageDiv = document.getElementById("message");
socket.on('history', function (chatHistory) {
    console.log("1");
    for (let i = 0; i < chatHistory.length; i++) {
        let item = document.createElement('li');
        item.textContent = chatHistory[i].login + " : " + chatHistory[i].content;
        if (chatHistory[i].user_id === 1) {
            item.className = "myMessage";
        } else {
            item.className = "interlocutorMessage";
        }
        messageDiv.appendChild(item);
    }
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('message', function (msg) {
    let item = document.createElement('li');
    item.textContent = userNickname + " : " + msg;
    item.className = "myMessage";
    messageDiv.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
