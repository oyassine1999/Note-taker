const express = require('express'); // import express module
const path = require('path'); // import path module
const fs = require('fs'); // import fs module
const bodyParser = require('body-parser'); // import body-parser module
const { v4: uuidv4 } = require('uuid'); // import uuid module

const app = express(); // create an express application instance
app.use(bodyParser.json()); // configure express to use body-parser middleware for JSON data
app.use(express.static(path.join(__dirname, 'Develop', 'public'))); // serve static files from 'Develop/public' directory
const dbPath = path.join(__dirname, 'Develop', 'db', 'db.json'); // define the path to the 'db.json' file

app.get('/favicon.ico', (req, res) => { // define route for favicon.ico
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'favicon.ico')); // serve the favicon.ico file
});

app.get('/notes', (req, res) => { // define route for '/notes'
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html')); // serve the 'notes.html' file
});

app.get('/', (req, res) => { // define route for '/'
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html')); // serve the 'index.html' file
});

app.get('/api/notes', (req, res) => { // define route for '/api/notes'
  fs.readFile(dbPath, 'utf8', (err, data) => { // read the 'db.json' file
    if (err) throw err;
    res.json(JSON.parse(data)); // send the data as JSON
  });
});

app.post('/api/notes', (req, res) => { // define route for creating a new note
  fs.readFile(dbPath, 'utf8', (err, data) => { // read the 'db.json' file
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = req.body; // get the new note data from the request body
    newNote.id = uuidv4(); // assign a unique id to the new note
    notes.push(newNote); // add the new note to the list of notes
    fs.writeFile(dbPath, JSON.stringify(notes), (err) => { // write the updated notes to the 'db.json' file
      if (err) throw err;
      res.json(newNote); // send the new note as JSON
    });
  });
});

app.delete('/api/notes/:id', (req, res) => { // define route for deleting a note
  fs.readFile(dbPath, 'utf8', (err, data) => { // read the 'db.json' file
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== req.params.id); // filter out the note to be deleted based on its id
fs.writeFile(dbPath, JSON.stringify(notes), (err) => { // write the updated notes to the 'db.json' file
if (err) throw err;
res.json(notes); // send the updated notes as JSON
});
});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});