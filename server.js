const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://nutritionblock.netlify.app", // Netlify URL 허용
    methods: ["GET", "POST"]
  }
});

// CORS 미들웨어 설정
app.use(cors({
  origin: "https://nutritionblock.netlify.app", // 요청을 허용할 도메인
  methods: ["GET", "POST"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

// WebSocket에서 RFID UID 수신 및 처리
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Arduino(ESP32)로부터 RFID UID 수신
  socket.on('rfid', (uid) => {
    console.log('RFID UID received:', uid);
    // 클라이언트로 UID 전송
    io.emit('rfid', uid);
  });
});

// 포트 설정 및 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
