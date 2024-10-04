const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 서버 설정
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 포트 설정
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 메시지를 받았을 때
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    socket.broadcast.emit('message', msg); // 다른 클라이언트에 메시지 전달
  });

  // 연결이 끊겼을 때
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
