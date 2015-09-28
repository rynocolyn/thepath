var express = require('express');
var mysql   = require('mysql');
var app     = express();

// +DB
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'thepath',
    debug    :  false
});

function dbquery(query, callback) {
  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      callback("error connecting to database", null);
      return;
    }

    connection.query(query, function(err,rows){
      connection.release();
      callback(err, rows);
      return;
    });

    connection.on('error', function(err) {
      callback(err, null);
      return;
    });
  });
};
// -DB

// +Other Functions
function showFirstQuestion(response) {
  dbquery("select id, question_text from questions where id=1;",
    function(err, data) {
      response.json({id: data[0].id, text: data[0].question_text});
    });
}
// -Other Functions

// +Routing

// Get Next Question Endpoint:
// Two parameters:
// 1. current question's id
// 2. answer (bool)
app.get('/next_question', function (request, response) {
  // Get parameters:
  var currentQuestionId = request.query.current_id;
  var answer = request.query.answer;

  // Validate parameters:
  // -- skipped --

  dbquery("select * from questions where id="+currentQuestionId+";",
    function (err, data) {
      if (!data || len(data)==0) {
        showFirstQuestion(response);
        return;
      }

      /*if (answer == true) {
        dbquery("select yes_question_index from questions where "+
          " id=" + currentQuestionId + ";", function(err, data) {
        });
      } else {
        // Get no question id
      }*/
    });

  /*var rows = dbquery("select * from questions;", function(err, rows) {
    if (err != null) {
      response.json({"error": err});
    } else {
      response.json(rows);
    }
  });
  console.log(rows);*/
  //response.json(rows);
});
// -Routing

// +Server
var server = app.listen(6060, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
// -Server