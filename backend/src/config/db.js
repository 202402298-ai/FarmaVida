const { Pool } = require('pg');

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'farmavida',
  user:     'postgres',
  password: 'postgres',
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL - FarmaVida'))
  .catch(err => console.error('❌ Error conectando a la DB:', err.message));

module.exports = pool;