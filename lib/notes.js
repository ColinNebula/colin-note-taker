// Dependencies
const fs = require("fs");
const path = require("path");
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
      path.join(__dirname, '../data/notes.json'),
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

  // Export
  module.exports = {
    filterByQuery,
    findById,
    createNewNote,
    validateNote
  };