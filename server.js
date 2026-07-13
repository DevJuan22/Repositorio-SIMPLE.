const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PUERTO = 3000;

// ===== MIDDLEWARES =====
// Permite leer JSON en el body de las peticiones (necesario para el form de contacto)
app.use(express.json());

// Sirve todos los archivos estáticos (html, css, js, imágenes) desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta del archivo donde guardaremos los mensajes recibidos
const ARCHIVO_MENSAJES = path.join(__dirname, 'data', 'mensajes.json');

// Si el archivo de mensajes no existe todavía, lo creamos vacío
if (!fs.existsSync(ARCHIVO_MENSAJES)) {
  fs.writeFileSync(ARCHIVO_MENSAJES, JSON.stringify([], null, 2));
}

// ===== RUTA: recibir mensajes del formulario de contacto =====
app.post('/api/contacto', (req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Validación básica en el servidor (nunca confíes solo en la validación del navegador)
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({
      ok: false,
      error: 'Todos los campos son obligatorios.'
    });
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({
      ok: false,
      error: 'El correo no tiene un formato válido.'
    });
  }

  // Leemos los mensajes existentes, agregamos el nuevo, y guardamos
  const mensajesActuales = JSON.parse(fs.readFileSync(ARCHIVO_MENSAJES, 'utf-8'));

  const nuevoMensaje = {
    id: Date.now(),
    nombre,
    email,
    mensaje,
    fecha: new Date().toISOString()
  };

  mensajesActuales.push(nuevoMensaje);
  fs.writeFileSync(ARCHIVO_MENSAJES, JSON.stringify(mensajesActuales, null, 2));

  console.log(`📩 Nuevo mensaje de contacto recibido de: ${nombre} (${email})`);

  res.status(200).json({
    ok: true,
    mensaje: 'Mensaje recibido correctamente. Te contactaremos pronto.'
  });
});

// ===== RUTA: ver mensajes guardados (solo para ti, como administrador) =====
app.get('/api/mensajes', (req, res) => {
  const mensajes = JSON.parse(fs.readFileSync(ARCHIVO_MENSAJES, 'utf-8'));
  res.json(mensajes);
});

app.listen(PUERTO, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
});