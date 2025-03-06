const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for announcements (replace with a real database in production)
let announcements = [];

// Route to get all announcements
app.get('/api/announcements', (req, res) => {
    res.json(announcements);
});

// Route to post a new announcement
app.post('/api/announcements', (req, res) => {
    const { title, message } = req.body;

    if (title && message) {
        const newAnnouncement = { title, message };
        announcements.push(newAnnouncement);
        res.status(201).json(newAnnouncement);
    } else {
        res.status(400).json({ error: 'Title and message are required.' });
    }
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
