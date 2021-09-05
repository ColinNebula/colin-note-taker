const fs = require('fs');
const path = require('path');

const express = require('express');

const { notes } = require('./data/notes');


// Ports in use
const PORT = process.env.PORT || 3001;
const app = express();
// Express Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// Parse incoming JSON data
app.use(express.json());

// Filter 
function filterByQuery(query, notesArray) {
  let noteTypesArray = [];
  let filteredResults = notesArray;
  if (query.noteTypes) {
    if (typeof query.noteTypes === 'string') {
      noteTypesArray = [query.noteTypes];
    } else {
      noteTypesArray = query.noteTypes;
    }
    noteTypesArray.forEach(type => {
      filteredResults = filteredResults.filter(
        note => note.noteTypes.indexOf(type) !== -1
      );
    });
  }
  
  return filteredResults;
}

// Find by Id
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// Create new note function
function createNewNote(body, notesArray) {
  const note = body;
  // our function's main code will go here!
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './data/notes.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
    );

  // return finished code to post route for response
  return note;
}

// Validate function
function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}
  // API call find by Query
app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
      results = filterByQuery(req.query, results);
  }
   res.json(results);
});


// API get call
  app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});

 app.post('/api/notes', (req, res) => {
   // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
   // add note to json file and notes array in this function
  const note = createNewNote(req.body, notes);

   res.json(note);
  }
 });


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