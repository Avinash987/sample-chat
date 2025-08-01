import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Store rooms and their users
const rooms = new Map();

io.on('connection', (socket) => {
    const username = socket.handshake.auth.token;
    console.log(`User connected: ${username}`);

    // Handle getting rooms list
    socket.on('getRooms', () => {
        const roomsList = Array.from(rooms.entries()).map(([id, room]) => ({
            id,
            name: room.name,
            users: room.users
        }));
        socket.emit('roomsList', roomsList);
    });

    // Handle room creation
    socket.on('createRoom', ({ name }) => {
        const roomId = Math.random().toString(36).substring(7);
        rooms.set(roomId, {
            name,
            users: [],
        });
        io.emit('roomsList', Array.from(rooms.entries()).map(([id, room]) => ({
            id,
            name: room.name,
            users: room.users
        })));
    });

    // Handle joining room
    socket.on('joinRoom', ({ roomId }) => {
        if (rooms.has(roomId)) {
            socket.join(roomId);
            const room = rooms.get(roomId);
            if (!room.users.includes(username)) {
                room.users.push(username);
            }
            io.to(roomId).emit('roomUsers', room.users);
        }
    });

    // Handle leaving room
    socket.on('leaveRoom', ({ roomId }) => {
        if (rooms.has(roomId)) {
            socket.leave(roomId);
            const room = rooms.get(roomId);
            room.users = room.users.filter(user => user !== username);
            io.to(roomId).emit('roomUsers', room.users);
        }
    });

    // Handle messages
    socket.on('sendMessage', ({ roomId, text }) => {
        const messageId = Math.random().toString(36).substring(7);
        io.to(roomId).emit('message', {
            id: messageId,
            text,
            username,
            timestamp: Date.now()
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${username}`);
        // Remove user from all rooms
        rooms.forEach((room, roomId) => {
            room.users = room.users.filter(user => user !== username);
            io.to(roomId).emit('roomUsers', room.users);
        });
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
