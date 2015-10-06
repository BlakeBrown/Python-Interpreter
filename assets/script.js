$(document).ready(function() {

	// Takes the code in the textarea and sends it to the backend via a POST request
	// The backend will compile the code and return the results
	$('#submit-code').on('click', function() {
		var code = $('#code-block').val();
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
					var error_text = JSON.parse(response.compiler_error);
					$(".compiler-response").html(error_text);
				} else if(response.compiler_response) {
					// Otherwise the code was compiled succesfully!
					var compiler_response = response.compiler_response;
					// Empty response box
					$(".compiler-response").text("");
					// Add every message from compiler
					for(var i = 0; i < compiler_response.length; i++) {
						var original_text = $(".compiler-response").text();
						$(".compiler-response").text(original_text + "\n" + compiler_response[i]);
						// Break in case user gets stuck in an infinite loop
						if(i > 1000) {
							break;
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
				console.log(response);
			}
		});
	});

	// Allows user to use tabs in the textarea (for editing code)
	$("textarea").keydown(function(e) {
	    if(e.keyCode === 9) { // tab was pressed
	        // get caret position/selection
	        var start = this.selectionStart;
	        var end = this.selectionEnd;

	        var $this = $(this);
	        var value = $this.val();

	        // set textarea value to: text before caret + tab + text after caret
	        $this.val(value.substring(0, start)
	                    + "\t"
	                    + value.substring(end));

	        // put caret at right position again (add one for the tab)
	        this.selectionStart = this.selectionEnd = start + 1;

	        // prevent the focus lose
	        e.preventDefault();
	    }
	});
});