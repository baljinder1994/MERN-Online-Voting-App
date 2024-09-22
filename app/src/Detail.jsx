import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const socket = io('http://localhost:5000');

const PollDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/polls/${id}`);
                setPoll(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching poll:', error);
                setLoading(false);
            }
        };

        fetchPoll();

        
        socket.on('voteUpdate', (updatedPoll) => {
            if (updatedPoll._id === id) {
                setPoll(updatedPoll);
            }
        });

        return () => {
            socket.off('voteUpdate');
        };
    }, [id]);

    const handleVote = async () => {
        if (selectedOption === null) {
            alert('Please select an option to vote.');
            return;
        }

        const userId = user ? user.id : null;

        if (!userId) {
            alert('User not logged in. Please log in to vote.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/polls/${id}/vote`, {
                optionIndex: selectedOption,
                userId,
            });
            setMessage('Vote recorded successfully!');
        } catch (error) {
            console.error('Error voting:', error);
            setMessage(error.response?.data?.message || 'Error recording your vote. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!poll) {
        return <p>Poll not found.</p>;
    }

    
    const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);

    return (
        <div className="poll-details-container">
            <h2 className="poll-title">{poll.question}</h2>
            <div className="options-container">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0;

                    return (
                        <div key={index} className="option-item">
                            <label>
                                <input
                                    type="radio"
                                    name="voteOption"
                                    value={index}
                                    onChange={() => setSelectedOption(index)}
                                />
                                {option.text} (Votes: {option.votes}) - {percentage}%
                            </label>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="vote-button" onClick={handleVote}>Vote</button>
            {message && <p className="message">{message}</p>}

         
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poll.options.map((option, index) => ({
                    name: option.text,
                    votes: option.votes,
                }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PollDetails;
