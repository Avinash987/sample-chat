import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '../services/socket';

interface Message {
    id: string;
    text: string;
    username: string;
    timestamp: number;
}

const ChatRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState<string[]>([]);
    const navigate = useNavigate();
    const username = localStorage.getItem('chatUsername');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!username || !roomId) {
            navigate('/');
            return;
        }

        socketService.connect(username);

        socketService.emit('joinRoom', { roomId });

        socketService.on('message', (newMessage: Message) => {
            setMessages(prev => [...prev, newMessage]);
        });

        socketService.on('roomUsers', (roomUsers: string[]) => {
            setUsers(roomUsers);
        });

        return () => {
            socketService.emit('leaveRoom', { roomId });
            socketService.disconnect();
        };
    }, [roomId, username, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && roomId) {
            socketService.emit('sendMessage', { roomId, text: message });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Online Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user}>{user}</li>
                    ))}
                </ul>
            </div>
            
            <div className="chat-main">
                <div className="messages-container">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id}
                            className={`message ${msg.username === username ? 'own-message' : ''}`}
                        >
                            <div className="message-header">
                                <span className="username">{msg.username}</span>
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="message-form">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
