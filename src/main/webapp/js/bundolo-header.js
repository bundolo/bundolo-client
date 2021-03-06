var token = "Basic " + btoa(" : ");
var username = "gost";
var slug = "";

$(document).ready(function() {
	var cookieToken = readCookie("token");
	var cookieUsername = readCookie("username");
	var cookieSlug = readCookie("slug");
	if (cookieToken && cookieUsername && cookieSlug) {
		token = cookieToken;
		username = cookieUsername;
		slug = cookieSlug;
		displayLoggedIn();
	} else {
		displayLogin();
	}

	//submit form when enter is pressed on input elements
	//TODO this is wrong on other header forms
	$(".header_form").keypress(function(event) {
	    if (event.which == 13 && event.target.nodeName.toLowerCase() == 'input' && !handlingForm) {
	    	handlingForm = true;
	    	event.preventDefault();
	    	login();
	    }
	});

	$('body').on('click', '.process_login', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			login();
		}
	});

	$('body').on('click', '.process_logout', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			logout();
		}
	});

	$('body').on('click', '.password_reset', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			passwordReset();
		}
	});

	$('body').on('click', '.process_register', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			register();
		}
	});

	$('body').on('click', '.save_author', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveAuthor();
		}
	});

	$('body').on('mouseenter', '.header_form>.btn-group, .content-header>.btn-group', function(e) {
		if (!$(this).hasClass('open')) {
			$(this).find('.dropdown-toggle').dropdown('toggle');
		}
	});

	$('body').on('mouseleave', '.header_form>.btn-group, .content-header>.btn-group', function(e) {
		if ($(this).hasClass('open')) {
			$(this).find('.dropdown-toggle').dropdown('toggle');
			$(this).find('.dropdown-toggle').blur();
		}
	});
});

function displayLogin() {
	$.get(rootPath + "/templates/login" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
		handlingForm = false;
	});
}

function displayRegister() {
	$.get(rootPath + "/templates/register" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
		handlingForm = false;
	});
}

function displayReset() {
	$.get(rootPath + "/templates/reset" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
		handlingForm = false;
	});
}

function displayLoggedIn() {
	$.get(rootPath + "/templates/logged_in" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, { "username": username });
		$(".header_form").html(rendered);
		handlingForm = false;
		updateLastActivity();
		checkTextAdding();
	});
}

function login() {
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var loginUsername = $("#login_username").val();
	var loginPassword = $("#login_password").val();
	var loginRememberMe = $('#login_remember').is(':checked');
	$.ajax({
	  url: rootPath + restRoot + "/auth",
	  type: "POST",
	  data: "username="+loginUsername+"&password="+loginPassword,
		complete: function (xhr, ajaxOptions, thrownError) {
			handlingForm = false;
			if (xhr.status == 200) {
				username = loginUsername;
				slug = xhr.responseText;
				token = "Basic " + btoa(loginUsername + ":" + loginPassword);
				if (loginRememberMe) {
					createCookie('token', token, 14);
					createCookie("username", username, 14);
					createCookie("slug", slug, 14);
				} else {
					createCookie('token', token);
					createCookie("username", username);
					createCookie("slug", slug);
				}
				displayLoggedIn();
				loadFromAddress();
			} else {
				displayModal("notification", null, null, "prijavljivanje nije uspelo!");
			}
		}
	});
}

function logout() {
	token = "Basic " + btoa(" : ");
	username = "gost";
	eraseCookie('token');
	eraseCookie('username');
	displayLogin();
	loadFromAddress();
}

function passwordReset() {
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var resetUsername = $("#reset_username").val();
	var resetEmail = $("#reset_email").val();
	$.ajax({
	  url: rootPath + restRoot + "/password",
	  type: "POST",
	  data: "username="+resetUsername+"&email="+resetEmail,
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
				  displayLogin();
				  displayModal("notification", null, null, 'password_reset_success');
			  } else {
				  displayModal("notification", null, null, data);
			  }
		  } else {
			  displayModal("notification", null, null, "resetovanje lozinke nije uspelo!");
		  }
      },
      error: function(data) {
    	  displayModal("notification", null, null, "resetovanje lozinke nije uspelo!");
      }
	});
}

function register() {
	if (!isFormValid($('.navbar-form'))) {
		return;
	}
	var user = {};
	user.email = $("#register_email").val();
	user.password = $("#register_password").val();
	user.username = $("#register_username").val();
	$.ajax({
		  url: rootPath + restRoot + "/author",
		  type: "POST",
		  data: JSON.stringify(user),
		  dataType: "json",
		  contentType: "application/json; charset=utf-8",
		  headers: {
		        'Accept': 'application/json',
		        'Content-Type': 'application/json'
		    },
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
				  displayModal("notification", null, null, "hvala na registraciji. poruka za validaciju vaše adrese elektronske pošte je poslata. u njoj su uputstva za aktivaciju vašeg korisničkog naloga.");
				  displayLogin();
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
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
						  displayModal("notification", null, null, "validacija je uspela!");
					  } else {
						  displayModal("notification", null, null, data);
					  }
				  } else {
					  displayModal("notification", null, null, "validacija nije uspela!");
				  }
		      },
		      error: function(data) {
		    	  displayModal("notification", null, null, "validacija nije uspela!");
		      }
			});
	}
}

function saveAuthor() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var user = {};
	user.username = username;
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
	user.newsletterSubscriptions = '[';
	if ($("#edit_bulletin_subscription").prop('checked')) {
		user.newsletterSubscriptions += '"bulletin"';
	}
	if ($("#edit_digest_subscription").val() != 'none') {
		if (user.newsletterSubscriptions.length > 1) {
			user.newsletterSubscriptions += ',';
		}
		user.newsletterSubscriptions += '"'+$("#edit_digest_subscription").val()+'"';
	}
	user.newsletterSubscriptions += ']';
	$.ajax({
		  url: rootPath + restRoot + "/author",
		  type: "POST",
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
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
	    		  if (user.password) {
					  logout();
					  displayModal("notification", null, null, "morate se prijaviti sa novom lozinkom.");
				  } else {
					  displayProfile();
				  }
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
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

function updateLastActivity() {
	var user = {};
	user.username = username;
	$.ajax({
		  url: rootPath + restRoot + "/author",
		  type: "POST",
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
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  if (xhr.status != 200) {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
	      }
	});
}

function getAvatarUrl(hash, size) {
	if (!hash) {
		hash = '532d5b1ca40d53c7261ec43324377b7b';
	}
	return "https://seccdn.libravatar.org/avatar/"+hash+"?s="+size+"&d=identicon";
}

function checkTextAdding() {
	$("#text_adding").html('<a role="menuitem" tabindex="-1" href="javascript:;" class="bg-danger" onClick="displayModal(\'notification\', null, null, \'text_adding_check\');" title="morate dodati bar tri komentara, odgovora na forumu, vesti, konkursa ili linkova od postavljanja prethodnog teksta">tekst</a>');
	$.ajax({
	    url: rootPath + restRoot + "/verify/text",
	    type: 'GET',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
	    	if (data) {
	    		$("#text_adding").html('<a role="menuitem" tabindex="-1" href="javascript:;" onClick="editSingleItem(\'text\');">tekst</a>');
	    	}
		},
		error: function(textStatus, errorThrown) {
			//TODO
		}
	});
}