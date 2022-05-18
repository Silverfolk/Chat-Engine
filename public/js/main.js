const socket=io();
const chatsub=document.getElementById('chat-form');
const chatMsg=document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Getting username and room from URL
const {username,room}=Qs.parse(window.location.search,{
    ignoreQueryPrefix:true
});

// Join chatroom
socket.emit('joinRoom',{username,room});


// Get Room and Users 

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

console.log(username,room);
socket.on('message',(message)=>{//here "message" is an event 
    console.log(message);
    printOnScreen(message);

    // for Scrolling down every time we send something
    chatMsg.scrollTop=chatMsg.scrollHeight;
});

chatsub.addEventListener('submit',(event)=>{
    event.preventDefault();
    const input=document.getElementById('msg');
    const msg=input.value;

    // Emitting  message to the server
    socket.emit("chatMessage",msg);

      // clear Input Field 
      event.target.elements.msg.value='';
      event.target.elements.msg.focus();
    
});

// Output message to Dom 
function printOnScreen(msg){
// we'll first create a div and then add that div to our message box 
   const div=document.createElement('div');
   div.classList.add('message');//adding 'message' class to the div 
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;

    // now we are adding the div inside 'chat-form' class form
    document.querySelector('.chat-messages').appendChild(div);
     
  
    
};


// Add Room Name to DOM

function outputRoomName(room){
roomName.innerText=room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  };


  //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });