const fs = require('fs');
const path = require('path');

const express = require('express');

const { notes } = require('./data/notes');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Ports in use
const PORT = process.env.PORT || 3001;
const app = express();
// Express Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// Parse incoming JSON data
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);




// html page route
 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// notes html page route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
// Chain the listen() method onto our server
// app.listen(PORT, () => {
//     console.log(`API server now on port ${PORT}!`);
//   });