const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const MessageObj=require('./utils/messages');
const {userJoin,getCurrentUser,userLeaves,ActiveUsers}=require('./utils/users');

const app= express();


const server=http.createServer(app);

const io=socketio(server);


// Setting static folder
app.use(express.static(path.join(__dirname,'public')));


// Running it on when clent is connnected
io.on('connection',socket=>{
console.log("new websocket connection");//jaise hi connection hoga ye message server pe print hoga 
// now to print the message on the html page 

socket.on('joinRoom',({username,room})=>{

    const user=userJoin(socket.id,username,room);

    socket.join(user.room);//basically ye karne se humne user ko room ke sath join karwa diya

// Welcome To Current User
socket.emit('message',MessageObj('SilverfolkBot','Welcome to silverchat'));//this is used to send it into the frontend to js page so that we could print it on browser console
// .emit method bas uski user ko cheez dikhayega jisne server ke sath connnect kiya hai

// Broadcast when a user connects -->user.to() karne se jo user hoga vo ussi room mai message karega jis room mai user hai
socket.broadcast.to(user.room).emit('message',MessageObj('SilverfolkBot',`${user.username} has joined the chat `));// iss method se basically unn bando ko message jayega jo server pe connected hai aur jo banda join kiya hai usko msg  nhi jayega

// io.emit() method se saare log jo server se connected hai unnko message jayega


// Send User and room info
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:ActiveUsers(user.room)
});
});




// Catching chatMessage that is bring from main.js
socket.on('chatMessage',(msg)=>{
    // now abb message ke sath naam dikhane ke liye 
    const user=getCurrentUser(socket.id);
    console.log(msg);
   io.to(user.room).emit('message',MessageObj(user.username,msg));
});

// Runs when client Disconnect
socket.on('disconnect',()=>{
    const user=userLeaves(socket.id);

    if(user){
        io.to(user.room).emit('message',MessageObj('SilverfolkBot',`${user.username} has left the chat`));
    }

    // Send User and room info as if anybody leaves the list needs to be updated 
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:ActiveUsers(user.room)
});
    
});
})
const port=3000 || process.env.port;

server.listen(port,()=>{
    console.log(`server running at port no ${port}`);
})