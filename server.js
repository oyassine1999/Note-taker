const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'Develop', 'public')));

app.get('/notes', (req, res) => {
res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.get('/api/notes', (req, res) => {
fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
if (err) throw err;
res.json(JSON.parse(data));
});
});

app.post('/api/notes', (req, res) => {
fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
if (err) throw err;
const notes = JSON.parse(data);
const newNote = req.body;
newNote.id = uuidv4();
notes.push(newNote);
fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), (err) => {
if (err) throw err;
res.json(newNote);
});
});
});

app.delete('/api/notes/:id', (req, res) => {
fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
if (err) throw err;
let notes = JSON.parse(data);
notes = notes.filter(note => note.id !== req.params.id);
fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), (err) => {
if (err) throw err;
res.json(notes);
});
});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});