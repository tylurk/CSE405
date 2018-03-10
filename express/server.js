const http = require('http');
const express = require('express');
const auth    = require('./auth');
const engine  = require('./engine');
const db = require('./db.js');
const qs = require('querystring');
const sessions = require('./sessions.js')

const app = express();
const static = express.static('public');
app.use(static);
app.use(auth);

app.engine('html', engine);
app.set('views', './views');

const port = 8000;
app.listen(port, () => {

});


app.get('/', function(req,res){
  const username = req.session.username;
  var params = {color: '', message: ''};

  db.getUserColor(username, (color) =>{
    params.color = color;
    db.getUserMessage(username, (message) =>{
        params.message = message;
        res.render('home.html', {params: params});
    });
  });

});

app.get('/color.html', function(req,res){
  const username = req.session.username;
  db.getUserColor(username, (color) =>{
    const params = {color: color, red: '', green: '', blue: ''};

    if(color === 'FF0000') params.red = 'checked';
    else if(color === '00FF00') params.green = 'checked';
    else if(color === '0000FF') params.blue = 'checked';

    res.render('color.html', {params: params});
  });
});

const urlencodedParser =  express.urlencoded({extended:false});
app.post('/color', urlencodedParser, (req, res) => {
  const username = req.session.username;
  const color = req.body.color;
  db.setUserColor(username, color, () => {
    res.redirect('/');
  });
});

app.post('/message', urlencodedParser, (req, res) =>{
  const username = req.session.username;
  const message = req.body.msg_box;
  db.setUserMessage(username, message, ()=>{
    res.redirect('/');
  });
});
