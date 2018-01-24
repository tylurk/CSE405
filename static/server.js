const http = require('http');
const st = require('st');

const port = 8000;

var mount = st({
  path: 'public/',
  index: 'index.html'
});

const response = 
 	'<div>You requested /hi.</div>';

const server = http.createServer((req, res) => {
  mount(req, res);
});

// if statement if user puts in hi for url.. will return html response, else will go as normal.
if (require.url === '/hi') {
	socket.on('data', (data) => {
		console.log('hi inbound :)');
		socket.end(response);
}) 
}else{
	server.listen(port, () => {
	        console.log(`Server running at http://localhost:${port}/`);
}) } ;