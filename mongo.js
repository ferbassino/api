// importamos mongoose
const mongoose = require("mongoose");
// gardams en una variable la url de coneccion a la base de datos. esa url la encontramos en el archivo .env. para poder utilizar lo devemos instalar dotenv, y requerirlo al inicio del index con require("dotenv").config(). "PONERLO EN EL .GITIGNORE" porque tiene datos sensibles
const connectionString = process.env.MONGO_DB_URI;

// conectamos a la base de datos con mongoose con el metodo connect que se la pasa  la url y tambien puede recibir un objeto de configuracion. el metodo recibe una promesa
mongoose
  .connect(connectionString, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // udeFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("database conected");
  })
  .catch((err) => {
    console.error(err);
  });

// luego definimos el esquema, donde definimos las variables de los datos que vamos a ingresar y el modelo que es lo que se va a instaciar. lo vemos e el modulo Note
