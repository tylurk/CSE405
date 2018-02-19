const http     = require('http');
const sessions = require('./sessions');
const qs 	   = require('querystring'); 
const st 	   = require('st');

const mount = st({
	path: 'public/'
});

const server = http.createServer();

server.listen(8000);

server.on('request', (req, res) => {
	sessions.filter(req, res);
	if (req.url === '/login.html') {
		mount(req,res);
	} else if (req.url === '/login') {
		handleLogin(req, res);
	} else if (!req.session.hasOwnProperty('username')) {
  		redirectLoginPage(res);
  	} else if (req.url === '/logout') {
		handleLogout(req, res);
	} else if (req.url === '/color') {
		handleColor(req, res);
	} else if (req.url === '/') {
		handleHome(req, res);
	} else {
		mount (req, res);
		}
	});

function handleHome(req, res){
		res.setHeader('Content-type', 'text/html');
		res.end(
		'<p style="color: #' + req.session.color + '"> Hello </p>' 				 +
		'<form action = "/color" method ="post" enctype="x-www-form-urlencoded">'+
		'<input type="radio" name="color" value="FF0000" /> Red   <br>'			 +
		'<input type="radio" name="color" value="00FF00" /> Green <br>'			 +
		'<input type="radio" name="color" value="0000FF" /> Blue  <br>'			 +
		'<input type = "submit" value="Submit"/>'								 +
		'</form>'                                                                +
		'<form method="POST" action="/logout">'                                  +
  		'<input type="submit" value="Logout" />'                                 +
		'</form>'
		);

}

function handleLogin(req,res){
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});
	req.on('end', () => {
		const form = qs.parse(body);
		if (form.username !== 'fred' || form.password !== '1234') {
		redirectLoginPage(res);
		} else {
		req.session.username = form.username;
		redirectHomePage(res);
		}
	});
}

function handleLogout(req, res) {
	delete req.session.username;
	redirectHomePage(res);
}

function redirectHomePage(res) {
		res.statusCode = 301;
  		res.setHeader('Location', '/');
  		res.end();
}

function redirectLoginPage(res) {
		res.statusCode = 301;
  		res.setHeader('Location', '/login.html');
  		res.end();
}



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