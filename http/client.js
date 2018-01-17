const net = require('net');

const socket = net.createConnection({
  host: 'localhost',
  port: 8000
});
