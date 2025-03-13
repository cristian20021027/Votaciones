const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Cambia si tu React está en otro puerto
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let votos = {};

app.get('/', (req, res) => {
  res.send('Servidor de votaciones activo');
});

app.post('/votar', (req, res) => {
  const { nombre, candidato } = req.body;
  if (nombre && candidato) {
    votos[candidato] = (votos[candidato] || 0) + 1;
    io.emit('actualizarResultados', votos); // Actualiza resultados en tiempo real
    res.status(200).send('Voto registrado');
  } else {
    res.status(400).send('Faltan datos');
  }
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
