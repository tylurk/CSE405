const net = require('net');

const socket = net.createConnection({
  host: 'localhost',
  port: 8000
});

socket.on('connect', () => {
  const req =
    'GET / HTTP/1.1  \r\n' +
    'Host: localhost \r\n' +
    '\r\n';
  socket.end(req);  // Send req string and then close this side of the TCP socket.
});

socket.on('data', (chunk) => {
  console.log(chunk.toString('utf8'));
});
