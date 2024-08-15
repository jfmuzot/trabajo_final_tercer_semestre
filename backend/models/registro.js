const pool = require('../config/database');

const getRegistros = async () => {
  const res = await pool.query('SELECT * FROM registro');
  return res.rows;
};


const updateRegistro = async (id, registro) => {
  const { tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario } = registro;
  const res = await pool.query(
    'UPDATE registro SET tiempo = $1, inhalaciones = $2, exhalaciones = $3, fecha = $4, ciclos = $5, id_usuario = $6 WHERE id_registro = $7 RETURNING *',
    [tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario, id]
  );
  return res.rows[0];
};

const createRegistro = async ({ id_registro, tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario }) => {
  const result = await pool.query(
    `INSERT INTO public.registro(
      id_registro, tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_registro, tiempo, inhalaciones, exhalaciones, fecha, ciclos, id_usuario]
  );
  return result.rows[0];
};

const getNextRegistroId = async () => {
  try {
    // Obtén el último ID de la tabla registros
    const result = await pool.query('SELECT MAX(id_registro) AS max_id FROM public.registro');
    const maxId = result.rows[0].max_id || 0; // Si no hay IDs en la tabla, empieza desde 1
    return maxId + 1;
  } catch (error) {
    console.error('Error al obtener el siguiente ID de registro:', error);
    throw new Error('Error al obtener el siguiente ID de registro');
  }
};

const deleteRegistro = async (id) => {
  await pool.query('DELETE FROM registro WHERE id_registro = $1', [id]);
};

module.exports = { getRegistros,createRegistro, getNextRegistroId,updateRegistro, deleteRegistro };
