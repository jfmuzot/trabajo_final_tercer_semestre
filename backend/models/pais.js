const pool = require('../config/database');

const getPaises = async () => {
  const res = await pool.query('SELECT * FROM pais');
  return res.rows;
};

const createPais = async (nombre) => {
  const res = await pool.query('INSERT INTO pais (nombre) VALUES ($1) RETURNING *', [nombre]);
  return res.rows[0];
};

const updatePais = async (id, nombre) => {
  const res = await pool.query('UPDATE pais SET nombre = $1 WHERE id_pais = $2 RETURNING *', [nombre, id]);
  return res.rows[0];
};

const deletePais = async (id) => {
  await pool.query('DELETE FROM pais WHERE id_pais = $1', [id]);
};

module.exports = { getPaises, createPais, updatePais, deletePais };

