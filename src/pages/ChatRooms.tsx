import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';

interface Room {
    id: string;
    name: string;
    users: string[];
}

const ChatRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('chatUsername');

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }

        socketService.connect(username);
        socketService.on('roomsList', (updatedRooms: Room[]) => {
            setRooms(updatedRooms);
        });

        socketService.emit('getRooms');

        return () => {
            socketService.disconnect();
        };
    }, [username, navigate]);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            socketService.emit('createRoom', { name: newRoomName });
            setNewRoomName('');
        }
    };

    const handleJoinRoom = (roomId: string) => {
        socketService.emit('joinRoom', { roomId });
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="rooms-container">
            <h1>Chat Rooms</h1>
            <form onSubmit={handleCreateRoom}>
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name"
                />
                <button type="submit">Create Room</button>
            </form>
            
            <div className="rooms-list">
                {rooms.map((room) => (
                    <div key={room.id} className="room-item">
                        <h3>{room.name}</h3>
                        <p>{room.users.length} users online</p>
                        <button onClick={() => handleJoinRoom(room.id)}>
                            Join Room
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatRooms;
