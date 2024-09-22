import React, { useState } from 'react';
import axios from 'axios';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question || options.length < 2) {
            alert('Please provide a question and at least two options.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/polls/create', {
                question,
                options
            });
            alert('Poll created successfully!');
            setQuestion('');
            setOptions(['', '']);
        } catch (err) {
            console.error('Error creating poll:', err.response?.data.message || err.message);
        }
    };

    return (
        <div className="create-poll-container">
            <h2>Create a New Poll</h2>
            <form onSubmit={handleSubmit} className="poll-form">
                <div className="form-group">
                    <label>Question:</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        className="poll-input"
                    />
                </div>
                <div className="form-group">
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-group">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                required
                                className="poll-input"
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(index)} className="remove-button">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addOption} className="add-option-button">
                    Add Option
                </button>
                <br />
                <button type="submit" className="submit-button">Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePoll;
