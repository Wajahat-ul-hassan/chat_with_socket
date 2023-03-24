const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//👇🏻 New imports
const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "<http://172.16.0.10:8000>"
    }
});
const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = []

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("createRoom", (roomName) => {
        socket.join(roomName);
        //👇🏻 Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: generateID(), roomName, messages: [] });
        //👇🏻 Returns the updated chat rooms via another event
        socket.emit("roomsList", chatRooms);
    });

    socket.on("findRoom", (id) => {
        //👇🏻 Filters the array by the ID
        let result = chatRooms.filter((room) => room.id == id);
        //👇🏻 Sends the messages to the app
        socket.emit("foundRoom", result[0].messages);
    });

    socket.on("newMessage", (data) => {
        //👇🏻 Destructures the property from the object
        const { room_id, message, user, timestamp } = data;
    
        //👇🏻 Finds the room where the message was sent
        let result = chatRooms.filter((room) => room.id == room_id);
    
        //👇🏻 Create the data structure for the message
        const newMessage = {
            id: generateID(),
            text: message,
            user,
            time: `${timestamp.hour}:${timestamp.mins}`,
        };
        //👇🏻 Updates the chatroom messages
        socket.to(result[0].name).emit("roomMessage", newMessage);
        result[0].messages.push(newMessage);
    
        //👇🏻 Trigger the events to reflect the new changes
        socket.emit("roomsList", chatRooms);
        socket.emit("foundRoom", result[0].messages);
    });

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔥: A user disconnected");
    });
});



app.use(cors());


app.get("/api", (req, res) => {
    res.json(chatRooms);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});