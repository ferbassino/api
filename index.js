const { response } = require("express");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "Aprendiendo Biomecánica con baskin",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("a ver que pasa");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const note = req.body;

  if (!note.content || !note.content) {
    return res.status(400).json({ error: "note .content is missing" });
  }

  const ids = notes.map((note) => note.id);
  const idMax = Math.max(...ids);
  const obj = {
    content: note.content,
    id: idMax + 1,
    date: new Date().toISOString(),
    important: typeof note.important !== "undefined" ? note.important : false,
  };
  notes = [...notes, obj];
  res.status(201).json(obj);
});

app.use((req, res) => {
  console.log(req.path);
  res.status(404).json({ error: "not found" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
});
