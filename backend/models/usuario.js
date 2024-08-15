const pool = require('../config/database');

const getUsuarios = async () => {
  const result = await pool.query('SELECT id_usuario,nombre_usuario,contrasena,correo,activo,perfil_administrador,pais_id FROM usuario'); // Ajusta la consulta según tu estructura de tabla
  return result.rows;
};


const updateUsuario = async (id, usuario) => {
  const { nombre_usuario, contrasena, nombre_completo, correo, activo, perfil_administrador, perfil_publico, pais_id } = usuario;
  const res = await pool.query(
    'UPDATE usuario SET nombre_usuario = $1, contrasena = $2, nombre_completo = $3, correo = $4, activo = $5, perfil_administrador = $6, perfil_publico = $7, pais_id = $8 WHERE id_usuario = $9 RETURNING *',
    [nombre_usuario, contrasena, nombre_completo, correo, activo, perfil_administrador, perfil_publico, pais_id, id]
  );
  return res.rows[0];
};

const deleteUsuario = async (id) => {
  await pool.query('DELETE FROM usuario WHERE id_usuario = $1', [id]);
};

const getNextUserId = async () => {
  try {
    // Obtén el último ID de la tabla usuarios
    const result = await pool.query('SELECT MAX(id_usuario) AS max_id FROM public.usuario');
    const maxId = result.rows[0].max_id || 1; // Si no hay IDs en la tabla, empieza desde 1
    return maxId + 1;
  } catch (error) {
    console.error('Error al obtener el siguiente ID:', error);
    throw new Error('Error al obtener el siguiente ID');
  }
};

const createUsuario = async ({ id_usuario, nombre_usuario, contrasena, nombre_completo, correo, pais_id, activo, perfil_administrador, perfil_publico }) => {
  const result = await pool.query(
    `INSERT INTO public.usuario(
      id_usuario, nombre_usuario, contrasena, nombre_completo, correo, activo, perfil_administrador, perfil_publico, pais_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [id_usuario, nombre_usuario, contrasena, nombre_completo, correo, activo, perfil_administrador, perfil_publico, pais_id]
  );
  return result.rows[0];
};

module.exports = { getUsuarios, createUsuario,getNextUserId, updateUsuario, deleteUsuario };
