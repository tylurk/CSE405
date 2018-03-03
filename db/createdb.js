const pg = require ('pg');

process.env.PGDATABASE = 'pg';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'starwarriors';  

const pool = new pg.Pool();

pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

pool.connect((err, client, done) => {
  if (err) throw err;
  });

function createTableUsers(client, done){
  const q = 'create table users (                 ' +
            '  username varchar(225) primary key, ' +
            '  password varchar(225) not null,    ' +
            '  color char(6),                     ' +
            '  message text                       ' +
            ')                                    ' ;

  client.query(q, (err) => {
    if (err) throw err;
    insertUser(client, done);
  })
  };

function insertUser(client, done){
  const q = "insert into users values ('fred', '1234', '0000FF', 'Enter text here: ')";
  client.query(q, (err) =>{
    if (err) throw err;
    done();
    pool.end();
  });
}