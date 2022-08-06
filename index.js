//requerimos dotenv ni bien arranca
require("dotenv").config();

// hacemos un require de el fichero de mongo que ejecuta lo que hay en mongo.js
require("./mongo");

const express = require("express");
const cors = require("cors");
const app = express();
// requerimos Note que tiene el esquema y el modelo
const Note = require("./models/Note");
const { response } = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

app.use(cors());

app.use(express.json());
let notes = [];
// ---GET---
app.get("/", (request, response, next) => {
  response.send("<h1>baskin</>").catch((error) => next(error));
});

// buscamos las notas que tienen el modelo Note, ademas vamos a mapear para que nos entregue solo lo que queremos, porque hay un _id y un __v en el objeto que no quremos. lo vamos a hacer en el esquema que esta en Notes. no lo podemos mapear acá porque el objeto de respuesta es muy complejo

app.get("/api/notes", (request, response, next) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch(next);
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  // le decimos que el id sea precisamente el id que le estmos pasando con el findById

  Note.findById(id)
    .then((note) => {
      if (note) {
        return response.json(note);
      } else {
        return response.status(404).end();
      }
    })
    // capturamos el error pero en el catch usamos un next para que pase al siguiente middleware
    .catch((err) => {
      next(err);
    });
});

// ---DELETE---
app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(404).end();
    })
    .catch(next);
});

// ---PUT---
// en el put, tambien debemos pasarle la nota que queremos actualizar, primero lo requerimos en el cuerpo de la request y luego creamos un objeto con los valores para actualizar
app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  const note = request.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  // acá pasamos la nota para actualizar junto con el id pero debemos pasarle un tercer parametro para que responda con el nuevo resultado (new:true)
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch(next);
});

// ---POST---
app.post("/api/notes", (request, response, next) => {
  // guardamos en una variable note lo que viene en el body
  const note = request.body;
  // validamos si o hay nota  contenido
  if (!note.content || !note.content) {
    return response.status(400).json({ error: "note .content is missing" });
  }
  // creamos la nota con el constructor Note
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: typeof note.important !== "undefined" ? note.important : false,
  });
  // guardamos la informacion con el metodo save y como es asincrono cuando tenemos guardada la nota y respondemos con la nota
  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch(next);
});

// añadimos un middleware que como primer parametro tiene el error, y en la funcion mirar que error tenemos y como el nombre del error es castError (o sea el error donde el id no coincide en este caso) le decimos: si el nombre del error es castError devuelve un 400, sino un 500, en el send imprimimos el error

// --MIDDLEWARES-- vienen de los respoectivos modulos
// de los errores
app.use(handleErrors);
// middleware para cuando no encuentra la ruta
app.use(notFound);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
});
