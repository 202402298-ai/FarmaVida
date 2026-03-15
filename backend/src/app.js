const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/usuarios',    require('./routes/usuarios.routes'));
app.use('/api/productos',   require('./routes/productos.routes'));
app.use('/api/categorias',  require('./routes/categorias.routes'));
app.use('/api/proveedores', require('./routes/proveedores.routes'));
app.use('/api/ordenes',     require('./routes/ordenes.routes'));
app.use('/api/dashboard',   require('./routes/dashboard.routes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🏥 FarmaVida API funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});