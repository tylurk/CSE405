/* Created by Tyler Clinscales on January 19, 2018.
simple http server for cse 405 */

const http = require('http');

// html message to be displayed
const html =
  "<html>"                           +
  "<head><title>405</title></head>"  +
  "<body><h1>hi</h1></body>"         +
  "</html>";

// create server as well as make server response to connections
const server = http.createServer((request, response) => {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/html');
	response.end(html);
});

// listen to local server 
server.listen(8000, () => {
	console.log("Local Server running");
});