const net = require('net');
const client = new net.Socket();
client.connect(8000, (), function() {
  console.log('Connected');
});
