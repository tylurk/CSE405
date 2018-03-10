const pg = require('pg');

process.env.PGDATABASE = 'express';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'pw';

const pool = new pg.Pool();


pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

  const q = 'create table users (            ' +
            '  username varchar(225) primary key, ' +
            '  password varchar(225) not null,    ' +
            '  color char(6),' +
            '  message text' +
            ')                              ';

  conn.query(q, (err) => {
    if (err) throw err;
    insertUser(conn, done);
  });
});

function insertUser(conn, done){
  const q = "insert into users values ('fred', '1234', '0000FF', 'Enter text here...')";
  conn.query(q, (err) =>{
    if (err) throw err;
    done();
    pool.end();
  });
}
