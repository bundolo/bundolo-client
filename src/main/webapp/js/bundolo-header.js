var token = "Basic " + btoa(" : ");
var username = "gost";

$(document).ready(function() {
	var cookieToken = readCookie("token");
	var cookieUsername = readCookie("username");
	if (cookieToken && cookieUsername) {
		token = cookieToken;
		username = cookieUsername;
		displayLoggedIn();
	} else {
		displayLogin();
	}
	
	//preload mouseover brand image to prevent flickering
	var brandOn = new Image();
	brandOn.src = "/img/brand_on.png";
	
	//submit form when enter is pressed on input elements
	$(".header_form").keypress(function(event) {
	    if (event.which == 13 && event.target.nodeName.toLowerCase() == 'input') {
	    	event.preventDefault();
	    	login();
	    }
	});
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
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var loginUsername = $("#login_username").val();
	var loginPassword = $("#login_password").val();
	var loginRememberMe = $('#login_remember').is(':checked');
	$.ajax({
	  url: rootPath + restRoot + "/auth/" + loginUsername,
	  type: "POST",
	  data: "password="+loginPassword,
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
				  username = loginUsername;
				  token = "Basic " + btoa(loginUsername + ":" + loginPassword);
				  if (loginRememberMe) {
					  createCookie('token', token, 14);
					  createCookie("username", 14);
				  } else {
					  createCookie('token', token);
					  createCookie("username", username);
				  }
				  displayLoggedIn();
				  //TODO extract type and id from address and reload content instead of going to home
	//			  if ($.address.value().lastIndexOf(rootFolder + "author", 0) === 0) {
	//				  displaySingleItem("author", $.address.value().substring(7));
	//			  }
				  $.address.value(rootFolder);
			  } else {
				  editSingleItem("notification", null, null, data);
			  }
		  } else {
			  editSingleItem("notification", null, null, "prijavljivanje nije uspelo!");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "prijavljivanje nije uspelo!");
      }
	});
}

function logout() {
	token = "Basic " + btoa(" : ");
	username = "gost";
	eraseCookie('token');
	eraseCookie('username');
	displayLogin();
	//TODO extract type and id from address and reload content instead of going to home
//	if ($.address.value() == rootFolder +"profile" || $.address.value() == rootFolder + "statistics") {
//		$.address.value(rootFolder);
//	} else if ($.address.value().lastIndexOf(rootFolder + "author", 0) === 0) {
//		displaySingleItem("author", $.address.value().substring(7));
//	}
	$.address.value(rootFolder);
}

function passwordReset() {
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var resetUsername = $("#reset_username").val();
	var resetEmail = $("#reset_email").val();
	$.ajax({
	  url: rootPath + restRoot + "/password/" + resetUsername,
	  type: "POST",
	  data: "email="+resetEmail,
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
				  displayLogin();
			  } else {
				  editSingleItem("notification", null, null, data);
			  }
		  } else {
			  editSingleItem("notification", null, null, "resetovanje lozinke nije uspelo!");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "resetovanje lozinke nije uspelo!");
      }
	});
}

function register() {
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var registerUsername = $("#register_username").val();
	var registerEmail = $("#register_email").val();
	var registerPassword = $("#register_password").val();
	var user = {};
	user.email = registerEmail;
	user.password = registerPassword;
	$.ajax({
		  url: rootPath + restRoot + "/author/" + registerUsername,
		  type: "PUT",
		  data: JSON.stringify(user),
		  dataType: "json",
		  contentType: "application/json; charset=utf-8",
		  headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
		  success: function(data) {  
			  if (data) {
				  if (data == 'success') {
					  editSingleItem("notification", null, null, "hvala na registraciji. poruka za validaciju vaše adrese elektronske pošte je poslata. u njoj su uputstva za aktivaciju vašeg korisničkog naloga.");
					  displayLogin();
				  } else {
					  editSingleItem("notification", null, null, data);
				  }
			  } else {
				  editSingleItem("notification", null, null, "registracija nije uspela!");
			  }
	      },
	      error: function(data) {
	    	  editSingleItem("notification", null, null, "registracija nije uspela!");
	      }
		});
}

function validateEmail() {
	if ($.address.parameter('nonce') && $.address.parameter('email')) {
		$.ajax({
			  url: rootPath + restRoot + "/validate/" + $.address.parameter('nonce'),
			  type: "POST",
			  data: "email="+$.address.parameter('email'),
			  success: function(data) {
				  if (data) {
					  if (data == 'success') {
						  editSingleItem("notification", null, null, "validacija je uspela!");
						  refreshSliderIfNeeded("authors");
						  refreshSidebarIfNeeded("authors");
					  } else {
						  editSingleItem("notification", null, null, data);
					  }
				  } else {
					  editSingleItem("notification", null, null, "validacija nije uspela!");
				  }
		      },
		      error: function(data) {
		    	  editSingleItem("notification", null, null, "validacija nije uspela!");
		      }
			});
	}
}

function saveAuthor() {
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var user = {};
	user.descriptionContent = {};
	user.descriptionContent.text = $("#edit_description").val();
	user.showPersonal = $("#edit_show_personal").prop('checked');
	user.firstName = $("#edit_first_name").val();
	user.lastName = $("#edit_last_name").val();
	user.gender = $("#edit_gender").val();
	user.birthDate = $("#edit_birth_date").val();
	if ($("#edit_email").val()) {
		user.newEmail = $("#edit_email").val();
	}
	if ($("#edit_password").val()) {
		//TODO check password, or send it instead of the one in the token
		user.password = $("#edit_password").val();
	}
	$.ajax({
		  url: rootPath + restRoot + "/author/" + username,
		  type: "PUT",
		  data: JSON.stringify(user),
		  dataType: "json",
		  contentType: "application/json; charset=utf-8",
		  beforeSend: function (xhr) {
			  xhr.setRequestHeader ("Authorization", token);
		  },
		  headers: { 
	          'Accept': 'application/json',
	          'Content-Type': 'application/json' 
		  },		  
		  success: function(data) {
			  if (data) {
				  if (data == 'success') {
					  $('#modal').modal('hide');
					  if (user.password) {
						  logout();
						  editSingleItem("notification", null, null, "morate se prijaviti sa novom lozinkom.");
					  } else {
						  displayProfile();
					  }				  
					  refreshSliderIfNeeded("authors");
					  refreshSidebarIfNeeded("authors");
				  } else {
					  editSingleItem("notification", null, null, data);
				  }
			  } else {
				  editSingleItem("notification", null, null, "saving_error");
			  }
	      },
	      error: function(data) {
	    	  editSingleItem("notification", null, null, "saving_error");
	      }
		});
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}