const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Create an express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite with Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // SQLite file will be stored here
});

// Define a model for the announcements
const Announcement = sequelize.define('Announcement', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

// Route to get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch announcements' });
  }
});

// Route to post a new announcement
app.post('/api/announcements', async (req, res) => {
  const { title, message } = req.body;

  if (title && message) {
    try {
      const newAnnouncement = await Announcement.create({ title, message });
      res.status(201).json(newAnnouncement);
    } catch (err) {
      res.status(500).json({ error: 'Unable to save the announcement' });
    }
  } else {
    res.status(400).json({ error: 'Title and message are required.' });
  }
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
