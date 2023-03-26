const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setTimeout } = require('timers/promises');
const io = new Server(server);
const port = process.env.PORT || 8000;



app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

const chatRooms = [
 
]

io.on('connection', (socket) => {
    console.log('a user connected');

    // setTimeout(()=>{
    //     io.emit("roomsList", chatRooms);
    // },4000)


    socket.on("roomsList", (roomName) => {
        console.log("🚀 ~ file: index.js:24 ~ socketIO.on ~ roomName:", roomName)
        socket.join(roomName);
        //👇🏻 Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: 123, roomName, messages: [] });
        //👇🏻 Returns the updated chat rooms via another event
        io.emit("roomsList", chatRooms);
    });

    // socket.on("findRoom", (id) => {
    //     //👇🏻 Filters the array by the ID
    //     let result = chatRooms.filter((room) => room.id == id);
    //     //👇🏻 Sends the messages to the app
    //     socket.emit("foundRoom", result[0].messages);
    // });

    // socket.on("newMessage", (data) => {
    //     //👇🏻 Destructures the property from the object
    //     const { room_id, message, user, timestamp } = data;
    
    //     //👇🏻 Finds the room where the message was sent
    //     let result = chatRooms.filter((room) => room.id == room_id);
    
    //     //👇🏻 Create the data structure for the message
    //     const newMessage = {
    //         id: generateID(),
    //         text: message,
    //         user,
    //         time: `${timestamp.hour}:${timestamp.mins}`,
    //     };
    //     //👇🏻 Updates the chatroom messages
    //     socket.to(result[0].name).emit("roomMessage", newMessage);
    //     result[0].messages.push(newMessage);
    
    //     //👇🏻 Trigger the events to reflect the new changes
    //     socket.emit("roomsList", chatRooms);
    //     socket.emit("foundRoom", result[0].messages);
    // });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});