var express     = require("express");
var app         = express();
var fs          = require('fs');
var path        = require("path");
var PythonShell = require('python-shell');

var random_string = 'for num in range(10,20):\
	print("hello world")';

fs.writeFile('my_script.py', random_string, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

var options = {
  mode: 'text',
  scriptPath: __dirname
};

pyshell = new PythonShell('my_script.py', options);

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

pyshell.on('recieve', function(data) {
	//console.log(data);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) {
  	console.log(err);
  }
  console.log('finished');
});

app.get('/',function(req,res){
  //__dirname resolves to the directory where the node.js script resides
  res.sendFile(path.join(__dirname + '/index.html'));
});

// app.get('/about',function(req,res){
//   res.sendFile(path.join(__dirname+'/about.html'));
// });

// app.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/sitemap.html'));
// });

app.listen(3000);

console.log("Running at Port 3000");