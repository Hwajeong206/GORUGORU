const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SerialPort = require('serialport'); // serialport 모듈 추가
const Readline = require('@serialport/parser-readline');

// 서버 설정
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 포트 설정
const PORT = process.env.PORT || 3000;

// 시리얼 포트 설정
const portName = '/dev/tty.wchusbserial210'; // 사용자 시리얼 포트 이름
const port = new SerialPort({ path: portName, baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// 클라이언트 연결
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 시리얼 데이터 수신
  parser.on('data', (data) => {
    console.log('Serial data received:', data.trim());
    socket.emit('serial-data', data.trim()); // 클라이언트에 데이터 전송
  });

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

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
