const http     = require('http');
const sessions = require('./sessions');
const qs 	   = require('querystring'); 
const st 	   = require('st');
const fs 	   = require('fs');

const mount = st({
	path: 'public/'
});

const homeTemplate  = fs.readFileSync('views/home.html', 'utf8');
const colorTemplate = fs.readFileSync('views/color.html', 'utf8');
const loginTemplate = fs.readFileSync('public/login.html', 'utf8');
const ErrorTemplate = fs.readFileSync('public/error.html', 'utf8');
const server 	    = http.createServer();

server.listen(8000);

server.on('request', (req, res) => {
	sessions.filter(req, res);
	if (req.url === '/login.html') {
		mount(req, res);
	} else if (req.url === '/login') {
		handleLoginPage(req, res);
	} else if (!req.session.hasOwnProperty('username')) {
  		redirectLoginPage(res);
  	} else if (req.url === '/logout') {
		handleLogout(req, res);
	} else if (req.url === '/color') {
		handleColorForm(req, res);
	} else if (req.url === '/color.html') {
		handleColorPage(req, res);
	} else if (req.url === '/') {
		handleHomePage(req, res);
	} else {
		mount (req, res);
		}
	});

function handleHomePage(req,res) {
  var html;
  var color;
  	db.getUserColor(req.session.username, (color) =>{
  	  	res.setHeader('Content-Type', 'text/html');
      	html = html.replace('#color#', color);
      	res.end(html);
    db.getUserMessage(req.session.username, (msg) =>{
      	res.statusCode = 200;
      	res.setHeader('Content-Type', 'text/html');
      	html = homeTemplate.replace('#message#', msg);
   
      });

    });
}
function handleLoginPage(req,res){
	let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () =>{
    const form = qs.parse(body);

    if(form.username === 'fred' && form.password === '1234'){
      req.session.username = form.username;
      loginError = false;
      redirectToHomePage(res);
    }else{
      console.log('Error: wrong username or password');
      loginError = true;
      redirectToLoginErrorPage(res);
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

function handleColorForm(req,res){
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

function handleColorPage(req, res){
  var html;
  switch (req.session.color) {
    case 'FF0000':
      html = colorTemplate.replace('#red#'   , 'checked');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , '       ');
      break;
    case '00FF00':
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , 'checked');
      html = html         .replace('#blue#'  , '       ');
      break;
    case '0000FF':
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , 'checked');
      break;
    default:
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , '       ');
      break;
  }

  	res.setHeader('Content-type', 'text/html');
  	res.end(html);

}

function handleColorForm(req,res){

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () =>{
    const form = qs.parse(body);
    if(form.color !== 'FF0000' &&
       form.color !== '00FF00' &&
       form.color !== '0000FF'){
         res.writeHead(302, {'Location': '/'});
         res.end();
    }
    db.setUserColor(req.session.username, form.color, ()=>{
      res.writeHead(302, {'Location': '/'}); 
      res.end();
    });
  });
}

function handleMessage(req, res){
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () =>{
    const form = qs.parse(body);

    db.setUserMessage(req.session.username, form.msg_box, ()=>{
      res.writeHead(302, {'Location': '/'});
      res.end();
    });
  });
}

function homePage(res){
	res.statusCode = 301;
  	res.writeHead(301, {'Location': '/'})
  	res.end();
}

function loginPage(res){
  	res.statusCode = 301;
  	res.writeHead(301, {'Location': '/login.html'})
  	res.end();
}

function errorPage(res){
	res.statusCode = 301;
 	res.writeHead(301, {'Location': '/error.html'})
  	res.end();
}
