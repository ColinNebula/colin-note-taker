// // Modules required
const router = require('express').Router();

// router.use(noteRoutes);
const { filterByQuery, findById, createNewNote, validateNote } = require('../../lib/notes');
const { notes } = require('../../data/notes');
  
// API call find by Query
  router.get('/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
     res.json(results);
  });
  
  
  // API get call
    router.get('/notes/:id', (req, res) => {
      const result = findById(req.params.id, notes);
      if (result) {
        res.json(result);
      } else {
        res.send(404);
      }
  });
  
   router.post('/notes', (req, res) => {
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

   // PUT route

   // Delete a note
// Delete a candidate
router.delete('/api/note/:id', (req, res) => {
  const sql = `DELETE FROM notes WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Note not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


// Export
module.exports = router;