var express     = require("express"),
	app         = express();
	fs          = require('fs'),
	path        = require("path"),
	PythonShell = require('python-shell'),
	bodyParser  = require('body-parser');

// Sets the directory path for the app (sets the correct path for loading css/js files, making ajax requests, etc)
//__dirname resolves to the directory where this script resides
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

// Get homepage
app.get('/',function(req,res) {
	res.sendFile('index.html');
});

// Basic options for python shell
var python_shell_options = {
	mode: 'text',
	scriptPath: __dirname
};

// Endpoint for python compiler
app.post('/python-compiler', function(req, res) {

    var code = req.body.code;

    // Write code to python script
    fs.writeFile('my_script.py', code, function (err) {
		if (err) throw err;
    });

    // Run the python script
    PythonShell.run('my_script.py', python_shell_options, function (err, results) {
    	var response;
		if (err) {
			response = {
				status  : 200,
				success : 'Error in script.',
				compiler_error: JSON.stringify(err.stack),
				err: err
			}
		} else {
			// results is an array consisting of messages collected during execution 
			response = {
				status  : 200,
				success : 'Compiled Succesfully.',
				compiler_response: results
			}
		}
		res.end(JSON.stringify(response));
    });
});

app.listen(3000);
console.log("Listening on port 3000")