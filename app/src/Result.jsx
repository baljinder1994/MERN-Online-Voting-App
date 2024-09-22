import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 
const VotingResults = () => {
    const [votes, setVotes] = useState({});

    useEffect(() => {
       
        socket.on('votingData', (data) => {
            setVotes(data);
        });

       
        socket.on('voteUpdate', (newData) => {
            setVotes(newData);
        });

        return () => {
            socket.off('votingData');
            socket.off('voteUpdate');
        };
    }, []);

    useEffect(() => {
        
        const ctx = document.getElementById('votingChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: Object.keys(votes),
                datasets: [
                    {
                        label: '# of Votes',
                        data: Object.values(votes),
                        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [votes]);

    return (
        <div>
            <h2>Voting Results</h2>
            <canvas id="votingChart" width="400" height="200"></canvas>
        </div>
    );
};

export default VotingResults;
