$(document).ready(function() {

	// Initialize libraries
	var editor = ace.edit("editor");
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/python");

	// Takes the code in the textarea and sends it to the backend via a POST request
	// The backend will compile the code and return the results
	$('#run-code').on('click', function() {
		var code = editor.getValue();
		$.ajax({
			url: 'python-compiler',
			method: 'POST',
			data: {
				code: code
			},
			success: function(res) {
				var response = JSON.parse(res);
				console.log(response);

				if(response.compiler_error) {
					// If the python compiler returned an error
					$("code").addClass("error");
					var error_text = JSON.parse(response.compiler_error);
					$(".compiler-response").html(error_text);
				} else if(response.compiler_response) {
					// Otherwise the code was compiled succesfully!
					$("code").removeClass("error");
					var compiler_response = response.compiler_response;
					// Empty response box
					$(".compiler-response").text("");
					// Add every message from compiler
					for(var i = 0; i < compiler_response.length; i++) {
						if(i == 0) {
							$(".compiler-response").text(compiler_response[0]);
						} else {						
							var original_text = $(".compiler-response").text();
							$(".compiler-response").text(original_text + "\n" + compiler_response[i]);
							// Break in case user gets stuck in an infinite loop
							if(i > 1000) {
								break;
							}
						}
					}
				} else {
					// We don't have an compiler error or success message :o something went wrong
				}
				console.log("success");
			}, 
			error: function(res) {
				var response = JSON.parse(res);
				console.log("error");
				alert("Something went wrong. Please contact us.");
			}
		});
	});

    runCode = function(event){
    	if (event.keyCode == 13){
    		var code = editor.session.getLine(editor.session.getLength() - 2);
    		console.log(code);
    	}
    }

    fileUpload = function(){

    }

    run = function(){
    	var code = editor.getValue();
    	console.log(code);
    }

    function readSingleFile(evt){
		var file = evt.target.files[0];

		if (file) {
			var reader = new FileReader();
			reader.onload = function(e){
				var content = e.target.result;
				console.log(content);
				editor.setValue(content);
			}
			reader.readAsText(file);
		}
		else{
			console.log("fail");
		}
	}
	document.getElementById('file').addEventListener('change',readSingleFile, false);
	var fileChooser = document.getElementById('file');
	fileChooser.onclick = function () {
	    this.value = '';
	};
});