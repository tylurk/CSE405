const http     = require('http');
const sessions = require('./sessions');
const qs 	   = require('querystring'); 

const server = http.createServer();

server.listen(8000);

server.on('request', (req, res) => {
	sessions.filter(req, res);
	if (req.url === '/color'){
		handleColor(req,res);
		console.log("need to process color choice");
	} else if (req.url === '/') {
		res.setHeader('Content-type', 'text/html');
	res.end(
		'<p style="color: #' + req.session.color + '"> Hello </p>' 					 +
		'<form action = "/color" method ="post" enctype="x-www-form-urlencoded">'+
		'<input type="radio" name="color" value="FF0000" /> Red   <br>'			 +
		'<input type="radio" name="color" value="00FF00" /> Green <br>'			 +
		'<input type="radio" name="color" value="0000FF" /> Blue  <br>'			 +
		'<input type = "submit" value="Submit"/>'								 +
		'</form>'
		);
	} else {
		res.writeHead(404);
		res.end('Not found');
		}
	});

function handleColor(req,res){
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});
	req.on('end', () => {
		const form = qs.parse(body);
		req.session.color = form.color;
		res.writeHead(302, { 'Location': '/' });
		res.end();
		});
}