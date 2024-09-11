const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messages = []; // In-memory store for messages

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', (socket) => {
    console.log('a user connected');

    // Send all messages to the newly connected client
    socket.emit('load messages', messages);

    // Listen for new messages and save them
    socket.on('send message', (message) => {
        messages.push(message);
        io.emit('receive message', message); // Broadcast the message to all clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
