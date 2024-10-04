// server.js (서버 파일)

const SerialPort = require('serialport');  // 시리얼 포트 라이브러리
const express = require('express');        // 웹 서버를 위한 express
const http = require('http');
const socketIO = require('socket.io');     // WebSocket 통신을 위한 socket.io

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });  // 시리얼 포트 초기화

// 시리얼 데이터 수신 시 이벤트 발생
port.on('data', (data) => {
  console.log('Received:', data.toString());
  io.emit('serialData', data.toString());  // 클라이언트에 시리얼 데이터 전달
});

// 서버 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/gorugorunutrition.html');  // 클라이언트에 index.html 제공
});

// 서버 실행
server.listen(3000, () => {
  console.log('listening on *:3000');
});
