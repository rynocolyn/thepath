var express = require('express');
var mysql     =    require('mysql');
var app = express();

// +DB
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'thepath',
    debug    :  false
});

function dbquery(req,res,query) {
  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error connecting to database"});
      return null;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(query,function(err,rows){
      connection.release();
      if(!err) {
        res.json(rows);
      }
    });

    connection.on('error', function(err) {
      res.json({"code" : 100, "status" : "Error connecting to database"});
      return null;
    });
  });
}

// -DB

// +Server
app.get('/', function (req, res) {
	dbquery(req, res, "select * from questions;")

});

var server = app.listen(6060, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// -Server