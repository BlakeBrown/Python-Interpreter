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

    var responseJSON, code = req.body.code;
    code = "import sys\nimport os\ndel os\nsys.modules['os']=None\n" + code;

    // Write code to external file 'python_script.py'
    fs.writeFile(path.join(__dirname, '/python_script.py'), code, function (err) {
		if (err) {
			responseJSON = {
				message : 'Error writing to file.',
				err: err
			}
			res.status(400).send(JSON.stringify(responseJSON));
		}
    });

    // Run the python script
    PythonShell.run('/python_script.py', python_shell_options, function (err, results) {
		if (err) {
			// err.stack contains the error message
			var response = err.stack;
			// Attempt to extract the line number from the first line of the error message
			var lineNumber = null;
			try {
				lineNumber = response.substr(0, response.indexOf('\n')).match(/\d+/)[0]-4; // subtract 4 from the actual line number since we appended 4 lines to the original code
				// Remove the first line of the error message since we don't need it anymore
				response = response.substr(response.indexOf('\n'));
			} catch(err) {
				// Couldn't extract the line number which means error message is of the form "Error: xyz..." - Let's remove the "Error: " substring
				response = response.substr(7); 
			}
			// Show the line number if we were able to extract one
			if(lineNumber) {
				response = 'Error on line ' + lineNumber + ':' + response;
			}
			// Remove errors related to the node child process
			response = response.substr(0, response.indexOf('at PythonShell'));
			// Build the response JSON
			responseJSON = {
				message : 'Error in python script.',
				compiler_error: JSON.stringify(response),
				err: err
			}
		} else {
			// "results" contains an array of messages recieved from stdout
			responseJSON = {
				message : 'Python script ran succesfully.',
				compiler_response: results
			}
		}
		// Before responding back to the client, delete the contents of the python script
	    fs.writeFile(path.join(__dirname, '/python_script.py'), '', function (err) {
			if (err) {
				responseJSON = {
					message : 'Error writing to file.',
					err: err
				}
				res.status(400).send(JSON.stringify(responseJSON));
			}
	    });
	    // Respond back to the client
	    res.status(200).send(JSON.stringify(responseJSON));
    });
});

app.listen(3002);
console.log("Online-Compiler listening on port 3002")