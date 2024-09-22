const express = require('express');
const Poll = require('../models/Poll');
const User = require('../models/User'); // Ensure User model is imported
const router = express.Router();

// Create a new poll
router.post('/create', async (req, res) => {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Poll must have a question and at least two options' });
    }

    try {
        const poll = new Poll({ question, options: options.map(option => ({ text: option, votes: 0 })) }); // Initialize votes
        await poll.save();
        res.status(201).json({ poll });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error creating poll', error });
    }
});

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.status(200).json(polls);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching polls', error });
    }
});

// Get a specific poll by ID
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.status(200).json(poll);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching poll', error });
    }
});

// Vote on a poll
router.post('/:id/vote', async (req, res) => {
    const { userId, optionIndex } = req.body;

    if (optionIndex === undefined) {
        return res.status(400).json({ message: 'Option index is required' });
    }

    try {
        const poll = await Poll.findById(req.params.id);
        const user = await User.findById(userId);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if the user has already voted
        if (user.votedPolls.includes(poll._id)) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        // Check if optionIndex is valid
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ message: 'Invalid option index' });
        }

        // Increment the vote count for the selected option
        poll.options[optionIndex].votes += 1;
        await poll.save();

        // Add the poll ID to the user's votedPolls
        user.votedPolls.push(poll._id);
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully', poll });
    } catch (error) {
        console.error('Error voting:', error); // Log the error details
        res.status(500).json({ message: 'Error voting', error: error.message });
    }
});


module.exports = router;
