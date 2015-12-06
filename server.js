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

    var response, code = req.body.code;

    // Write code to external file 'python_script.py'
    fs.writeFile('python_script.py', code, function (err) {
		if (err) {
			response = {
				message : 'Error writing to file.',
				err: err
			}
			console.log(err);
			res.status(400).send(JSON.stringify(response));
		}
    });

    // Run the python script
    PythonShell.run('python_script.py', python_shell_options, function (err, results) {
		if (err) {
			// err.stack contains a JSON representation of the error message
			response = {
				message : 'Error in script.',
				compiler_error: JSON.stringify(err.stack),
				err: err
			}
		} else {
			// results contains an array of messages recieved from stdout
			response = {
				message : 'Compiled Succesfully.',
				compiler_response: results
			}
		}
		res.status(200).send(JSON.stringify(response));
    });
});

app.listen(3002);
console.log("Listening on port 3002")