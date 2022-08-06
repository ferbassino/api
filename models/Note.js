// importamos mongoose
const mongoose = require("mongoose");

// ---ESQUEMA---
// definimos el esquema con el metodo Schema de mongoose, con cada variable con su constructor, la id la genera mongo
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// vamos a definir un poco mas el esquema para evitar que nos entregue el _id y el __v que no lo queremos. Le decimos, a noteSchema, al metodo set, que el metodo toJSON tiene que transformar
noteSchema.set("toJSON", {
  // le dams dos parametros  el documento que estamos transformando y lo que nos devuelve. por ejemplo que gurade como id al _id. luego borramos el _id y el __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// ---MODELO---
// con el esquema creamos un mdelo para instanciar los datos
// guardamos el modelo en una variable. el metodo model recibe dos parametros: el nombre del modelo y el esquema que tiene. esto mantiene la cordura de los documentos que estamos creando

const Note = mongoose.model("Note", noteSchema);

// ---CREAMOS UNA NOTA---
// luego creamos una nota con el constructor Note que ya definimos

// const note = new Note({
//   content: "Esta es la tercera",
//   date: new Date(),
//   important: true,
// });

// con el metodo save la guardamos en la base
// recordar cerrar la conexion a la base
// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// tmabien podemos buscar resultados, que es lo que vamos a hacer con el get en el index:
// del modelo Note, encuentra todos los objetos

// Note.find({}).then((result) => {
//   console.log(result);
//   mongoose.connection.close();
// });

// ---EXPORTAMOS EL MODELO---
module.exports = Note;
