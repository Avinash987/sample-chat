import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            localStorage.setItem('chatUsername', username);
            navigate('/rooms');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h1>Join Chat</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                />
                <button type="submit">Join</button>
            </form>
        </div>
    );
};

export default Login;
