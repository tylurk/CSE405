const express = require('express');
const sessions = require('./sessions.js');
const db =  require('./db.js');

const urlencodedParser =  express.urlencoded({extended:false});
const router = express.Router();
module.exports = router;

router.use(function(req,res,next){

  sessions.filter(req,res);

  next();
});

router.post('/login', urlencodedParser, function(req,res){
  const username = req.body['username'];
  const password = req.body.password;
  db.getUser(username, password, (user) =>{
    if(user === null){

      res.redirect('/error.html');
    }else{
      req.session.username = username;
      res.redirect('/');
    }
  });
});

router.post('/logout', function(req,res){
  delete req.session.username;
  res.redirect('/login.html');
});


router.use(function(req, res, next){
  if(req.session.hasOwnProperty('username')){
    next();
  }else{
    res.redirect('/login.html');
  }
});
