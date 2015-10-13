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

function showYesQuestion(response, currentQuestion) {
  var query = "select id, question_text from questions where " +
    "id=(select yes_child_index from questions where id="+currentQuestion.id+
      ");";
  console.log(query);

  dbquery(query, function(err, data) {
    if (data && data.length > 0) {
      response.json({id: data[0].id, text: data[0].question_text});
    } else {
      response.json({id: 0, text: ""});
    }
  });
}

function showNoQuestion(response, currentQuestion) {
  dbquery("select id, question_text from questions where " +
    "id=(select no_child_index from questions where id="+currentQuestion.id+
      ");", function(err, data) {
    if (data && data.length > 0) {
      response.json({id: data[0].id, text: data[0].question_text});
    } else {
      response.json({id: 0, text: ""});
    }
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
      if (!data || data.length==0) {
        showFirstQuestion(response);
        return;
      }

      if (answer == "yes") {
        showYesQuestion(response, data[0]);
      } else {
        showNoQuestion(response, data[0]);
      }
    });
});

app.get("/", function (request, response) {
  response.put(someHtmlPageFile); // <-- Do this part
  // Look at how express.js handles html files
  // API Documentation:

  // Next Question: /next_question?current_id=5&answer=yes
  // Parameters:
  // current_id:  the id of the currently visible question. If left out, the
  //              first question is displayed.
  // answer:      yes for answering yes, no for answering no. Defaults to no if
  //              left out.

  // Limitation: You are not allowed to use the "response" variable to send
  // over question data
  // Bonus points if you use jquery

  // Assignment 1: Do the above
  // Assignment 2: Figure out how to avoid SQL injection vulnerability
});
// -Routing

// +Server
var server = app.listen(6060, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
// -Server