import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            alert('Login Successful');

            const userData = { id: response.data.userId, username: response.data.username }; // Adjust according to your API response
            login(userData); // Call the login function to set user in context

            localStorage.setItem('token', response.data.token);
            navigate('/dash');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            console.error('Login failed:', err.response?.data?.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
