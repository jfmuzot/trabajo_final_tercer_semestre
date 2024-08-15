// routes/index.js

const express = require('express');
const router = express.Router();
const { getPaises, createPais, updatePais, deletePais } = require('../models/pais');
const { getUsuarios, createUsuario,getNextUserId, updateUsuario, deleteUsuario } = require('../models/usuario');
const { getRegistros,getNextRegistroId, createRegistro, updateRegistro, deleteRegistro } = require('../models/registro');

// Rutas para pais
router.get('/pais', async (req, res) => {
  try {
    const paises = await getPaises();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pais', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pais');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para usuario
router.get('/usuario', async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.post('/usuario', async (req, res) => {
  try {
    const nuevoUsuario = await createUsuario(req.body);
    res.json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params; // Asegúrate de que id se define fuera del try/catch
  try {
    console.log(req.params); // Añade esto para depuración
    console.log(`Actualizando usuario con ID: ${id}`); // Depuración adicional
    const updatedUsuario = await updateUsuario(id, req.body);
    res.json(updatedUsuario);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error); // Ahora id está disponible aquí
    res.status(500).json({ error: error.message });
  }
});



router.delete('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUsuario(id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para registro
router.get('/registro', async (req, res) => {
  try {
    const registros = await getRegistros();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/registro', async (req, res) => {
  const { tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario } = req.body;

  // Generar un ID de registro
  const id_registro = await getNextRegistroId();

  try {
    // Llamar a la función para insertar el nuevo registro en la base de datos
    const nuevoRegistro = await createRegistro({
      id_registro,
      tiempo,
      inhalaciones,
      exhalaciones,
      fecha: new Date(fecha), // Asegurarse de que la fecha sea un objeto Date
      ciclos,
      id_usuario
    });

    res.status(201).json({ message: 'Registro creado exitosamente', registroId: nuevoRegistro.id_registro });
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/registro/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const actualizadoRegistro = await updateRegistro(id, req.body);
    res.json(actualizadoRegistro);
  } catch (error) {
    console.error(`Error updating record with ID ${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/registro/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRegistro(id);
    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuarios = await getUsuarios(); // Verifica qué datos devuelve esta función
    console.log('Usuarios:', usuarios); // Agrega esta línea para depurar

    const usuario = usuarios.find(user => user.correo === correo && user.contrasena === contrasena);

    if (usuario) {
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { nombre_usuario, contrasena, nombre_completo, correo, pais_id } = req.body;

  console.log('Datos recibidos:', req.body); // Verifica que pais_id esté presente

  // Generar un ID de usuario aleatorio
  const id_usuario = await getNextUserId();

  try {
    // Llamar a la función para insertar el nuevo usuario en la base de datos
    const nuevoUsuario = await createUsuario({
      id_usuario,
      nombre_usuario,
      contrasena,
      nombre_completo,
      correo,
      pais_id,
      activo: true, // Valor por defecto
      perfil_administrador: false, // Valor por defecto
      perfil_publico: true // Valor por defecto
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: nuevoUsuario.id_usuario });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
