const pg = require ('pg');

process.env.PGDATABASE = 'pg';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'starwarriors';  

const pool = new pg.Pool();

pool.on('error', (err, client) =>{
	console.log (err.stack);
	process.exit(-1);
});

function createTest(client, done) {
  const q = 'create table test (            ' +
            '  id varchar(255) primary key, ' +
            '  x integer                    ' +
            ')                              ';
  client.query(q, (err) => {
   insertA(client, done);
  });
}

function insertA(client, done) {
	insertRow(client, 'a', 1, () => {
		insertB(client, done)
	});
}

function insertRow(client, id, x, cb) { 
  client.query("insert into test values ($1::text, $2)", [id, x], (err) => {
   cb();
  });
}

function insertB(client, done) {
	insertRow(client, 'b', 2, () => {
		insertB(client, done)
	});
}

function insertC(client, done) {
	insertRow(client, 'c', 3, () => {
		done();
		pool.end();
	});
}

function selectAll(client, cb) {
  client.query("select * from test order by id", (err, result) => {
    if (err) throw err;
    result.rows.map((row, i) => {
      console.log('  ' + i + " " + row.id + ' ' + row.x);
    });
    cb();
  });
}

pool.connect((err, client, done) =>{
	if (err) throw err;
	done();
	createTest(client, done);
});

function updateRow(client, id, x, cb) {
	client.query("update test set x = $1 where id = $2::text", [x, id], (err) =>{
		if(err) throw err;
		cb();
	});
}

function deleteRow(client, id, cb) {
	client.query("delete from test where id = $1::text", [id], (err) => {
		if (err) throw err;
		cb();
	});
}

function selectB(client, done) {
	selectById(client, 'b', () => {
		updateB(client, done);
	});
}

function updateB(client, done) {
	updateRow(client, 'b', 22, () => {
	done();
	pool.end();
	});
}

function selectAll1(client, done) {
	selectAll(client, () => {
		deleteB();
	});
}

function deleteB (client, done) {
	deleteRow(client, 'b', () => {
	selectAll2(client, done);
	myEnd(client, done);
	});
}

function selectAll2(client, done) {
	selectAll(client, () => {
		deleteB();
	});
}

function myEnd(client, done) {
	done();
	pool.end();
}
