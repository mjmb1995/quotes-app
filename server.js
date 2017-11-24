var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 3000;

// middleware to serve static content for the app
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "TsUbAsA330",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Express and MySQL code should go here.
// home page
app.get("/", function(req, res){
  connection.query("SELECT * FROM quotes;", function(err, data){
    if (err){
      return res.status(500).end();
    }
    res.render("index", { quotes: data});
  });
});

app.post("/api/quotes", function(req, res){
  connection.query("INSERT INTO quotes (author, quote) VALUES (?, ?)", [
    req.body.author, req.body.quote
  ], function(err, result){
    if (err) {
      return res.status(500).end();
    }

    // Send back the ID of the new wish
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  })
})

// Retrieve all quotes
app.get("/quotes", function(req, res) {
  connection.query("SELECT * FROM quotes;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});





app.listen(port, function() {
  console.log("Listening on PORT " + port);
});
