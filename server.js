/*
* author: l
* file: server.js 
* http://iduniven.herokuapp.com
*/

var express = require('express'),
	app = new express(),
	url = require("url"),
	path = require("path"),
	pg = require('pg');
var port = process.env.PORT || 5000;
var host = process.env.HOST || "127.0.0.1";
var bodyParser = require('body-parser');

app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var conString= process.env.DATABASE_URL || 'InsertYourOwnDBsCredentials';


pg.connect(conString, function(err, client) {
	var query2 = client.query("CREATE TABLE IF NOT EXISTS DATES2(NAME varchar(64), BD varchar(64),STAMP varchar(64));");
	var query3 = client.query("CREATE TABLE IF NOT EXISTS STAMP(TSTAMP varchar(64));");
});

app.get('/', function(req, res) { 
	res.sendFile(__dirname + '/home.html'); 
});

app.post('/resp',function(req,res){
	pg.connect(conString, function(err, client) {
		var query2 = client.query("INSERT INTO DATES2(NAME,BD) VALUES('"+req.body.n+ "','" +req.body.bd +"');");
		var query3 = client.query("INSERT INTO STAMP(TSTAMP) VALUES('"+req.body.tstamp+"');");
	});
	res.end();
});

app.post('/logs',function(req,res){
	pg.connect(conString, function(err, client) {
		var str ="";
		var query = client.query("SELECT * FROM DATES2;");
		query.on('row', function(row) {
			console.log(row);
			str = str + "\n" +JSON.stringify(row);
		});
		query.on('end', function(result) {
			res.end(str);
		});
	});
});
