
for (let i = 0; i <= 9; i++){
    let a = "2";
    a <<= i;
    console.log(a);
}

const socket = io();

//let messageDiv = document.getElementById("message");

////
//<audio id="audioPlayer" src="C:\Users\arash\Downloads\tuturu-steins-gate-sound-effect (mp3cut.net).mp3"></audio>
//let audioPlayer = document.getElementById("audioPlayer");
//let playButton = document.getElementById("playButton");

//playButton.addEventListener("click", function() {
//    console.log(audioPlayer.pause);
//  if (audioPlayer.pause) {
//    audioPlayer.play(); 
//  } else {
//    audioPlayer.pause(); 
//  }
//});
//////

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let inputText = document.querySelector('input[type="text"]');
    if(inputText.value) {
        socket.emit('new_message', inputText.value);
        inputText.value = "";
    }
});

let userNickname = prompt("enter your nickname");
    while(userNickname === ""){
        userNickname = prompt("enter your nickname");
    }

socket.emit("changeNickname",userNickname);

let messageDiv = document.getElementById("message");
socket.on('history', function(chatHistory) {
    for(let i = 0; i < chatHistory.length; i++){
        let item = document.createElement('li'); 

        item.textContent = userNickname + " : " + chatHistory[i].content
        if(chatHistory[i].author_id == "6"){
            item.className = "myMessage";
        }else{
            item.className = "interlocutorMessage";
        }
        messageDiv.appendChild(item); 
    };
    window.scrollTo(0, document.body.scrollHeight); 
});


socket.on('message', function(msg) {
    let item = document.createElement('li'); 
    item.textContent = userNickname + " : " + msg; 
    item.className = "myMessage";
    messageDiv.appendChild(item); 

    window.scrollTo(0, document.body.scrollHeight); 
});
