const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./controlador/breathController'); // Ajusta la ruta según la ubicación de tu archivo de rutas

const app = express();
const port = 3000; // O el puerto que estés usando

app.use(cors()); // Permite solicitudes de origen cruzado (CORS)
app.use(bodyParser.json()); // Analiza las solicitudes con cuerpo JSON

app.use('/api', routes); // Registra las rutas bajo el prefijo /api

app.listen(port, () => {
  console.log(`El servidor se esta ejecutando en http://localhost:${port}`);
});
