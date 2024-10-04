// server.js (서버 파일)

const SerialPort = require('serialport');  // 시리얼 포트 라이브러리
const express = require('express');        // 웹 서버를 위한 express
const http = require('http');
const socketIO = require('socket.io');     // WebSocket 통신을 위한 socket.io
const path = require('path');              // 경로 처리를 위한 path 모듈

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 정적 파일 서빙을 위해 public 디렉토리 설정 (이미지, CSS 등)
app.use(express.static(path.join(__dirname, 'public')));

// 시리얼 포트 초기화 (포트 이름은 실제 환경에 맞게 변경하세요)
const port = new SerialPort('/dev/tty.wchusbserial210', { baudRate: 9600 });

// 시리얼 데이터 수신 시 이벤트 발생
port.on('data', (data) => {
    const tag = data.toString().trim();
    console.log('Received:', tag);
    io.emit('serialData', tag);  // 클라이언트에 시리얼 데이터 전달
});

// 서버 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'gorugorunutrition.html'));  // 클라이언트에 HTML 제공
});

// 서버 실행
server.listen(3000, () => {
    console.log('listening on *:3000');
});
