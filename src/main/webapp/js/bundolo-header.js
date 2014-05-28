$(document).ready(function() {
	displayLogin();
});

function displayLogin() {
	$.get('templates/login.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayRegister() {
	$.get('templates/register.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayReset() {
	$.get('templates/reset.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayLoggedIn() {
	$.get('templates/logged_in.html', function(template) {
	    var rendered = Mustache.render(template, {
		});
		$(".header_form").html(rendered);
	});
}

function displayStatusBar(title) {
	$('.status_bar>div').text(title);
}