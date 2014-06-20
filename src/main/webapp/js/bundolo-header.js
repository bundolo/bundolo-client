$(document).ready(function() {
	displayLogin();
});

function displayLogin() {
	$.get('/templates/login.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayRegister() {
	$.get('/templates/register.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayReset() {
	$.get('/templates/reset.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayLoggedIn() {
	$.get('/templates/logged_in.html', function(template) {
	    var rendered = Mustache.render(template, { "username": username });
		$(".header_form").html(rendered);
	});
}

function displayStatusBar(title) {
	$('.status_bar>div').text(title);
}

function login() {
	var loginUsername = $("#login_username").val();
	var loginPassword = $("#login_password").val();
	var loginRememberMe = $('#login_remember').is(':checked');
	$.ajax({
	  url: rootPath + restRoot + "/auth/" + loginUsername,
	  type: "POST",
	  data: "password="+loginPassword,
	  success: function(data) {
		  if (data) {
			  console.log("success: " + JSON.stringify(data));
			  username = loginUsername;
			  token = "Basic " + btoa(loginUsername + ":" + loginPassword);
			  if (loginRememberMe) {
				  $.cookie('token', token, { expires: 14 });
			  }
			  displayLoggedIn();
		  } else {
			  alert("login failed");
		  }
      },
      error: function(data) {
    	  alert("login failed");
      },
      complete: function(data) {
//    	  console.log("complete: " + JSON.stringify(data));
      }
	});
	
}