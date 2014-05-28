$(document).ready(function() {
	$('body').on('show.bs.tab', '.main .connections a[data-toggle="tab"]', function(e) {
		$('.main .connection').html('');
	});
	$('body').on('click', '.sidebar #collapse_connections table>tbody>tr', function(e) {
		displayDummyConnection();
	});
});

function addConnection() {
	$('#modal').addClass("edit-connection");
	$('#editor_label').html('Add connection');
	$('#modal').modal('show');
}

function saveConnection(title, content) {
	//TODO validation
	displayConnection(title, content);
	$('#modal').modal('hide');
}
function display_connections() {
	$.get('templates/connections.html', function(template) {
	    var rendered = Mustache.render(template, {
			  "groups": [
			 			    { "title": "Literature", "id" : "literature" },
			 			    { "title": "Culture", "id" : "culture" },
			 			    { "title": "Alternative comics", "id" : "comics" },
			 			    { "title": "Online magazines", "id" : "magazines" },
			 			    { "title": "Underground culture", "id" : "underground" }
			 			  ]
			 			});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content connections');
	    displayContent(contentElement, rendered);
	  });
}
function displayConnection(connection) {
	$.get('templates/connection.html', function(template) {
	    var rendered = Mustache.render(template, connection);
	    var contentElement = $('.main>.jumbotron>.content');
	    displayContent(contentElement, rendered);
	});
}
function displayDummyConnection() {
	displayConnection(generateDummyConnection(587));
}
function generateDummyConnection(id) {
	return { "title": "Razorback sucker" + id, "author" : "dummy_user" + id, "date" : "10. 05. 2014.", "last_activity" : "11. 05. 2014.", "description" : "dragonet spiny dogfish cuckoo wrasse" + id, "content" :
		'<p>Combtooth blenny houndshark clown triggerfish paperbone,\
		"European eel tilapia sea snail tilapia waryfish," Bitterling\
		crocodile shark. Flagblenny Hammerjaw stonecat freshwater herring\
		false brotula false moray; kanyu Atlantic eel blue triggerfish\
		weeverfish Rainbowfish leaffish. Rudderfish alligatorfish,\
		Billfish gray reef shark Razorback sucker flounder quillback;\
		clownfish medusafish Atlantic trout? Gouramie bichir frilled shark\
		dragonet spiny dogfish cuckoo wrasse. kanyu Atlantic eel blue triggerfish\
		weeverfish Rainbowfish leaffish. Rudderfish alligatorfish,\
		Billfish gray reef shark Razorback sucker flounder quillback;\
		clownfish medusafish Atlantic trout? Gouramie bichir frilled shark\
		dragonet spiny dogfish cuckoo wrasse.</p>\
	<p>Combtooth blenny houndshark clown triggerfish paperbone,\
		"European eel tilapia sea snail tilapia waryfish," Bitterling\
		crocodile shark. Flagblenny Hammerjaw stonecat freshwater herring\
		false brotula false moray; kanyu Atlantic eel blue triggerfish\
		weeverfish Rainbowfish leaffish. Rudderfish alligatorfish,\
		Billfish gray reef shark Razorback sucker flounder quillback;\
		clownfish medusafish Atlantic trout? Gouramie bichir frilled shark\
		dragonet spiny dogfish cuckoo wrasse. kanyu Atlantic eel blue triggerfish\
		weeverfish Rainbowfish leaffish. Rudderfish alligatorfish,\
		Billfish gray reef shark Razorback sucker flounder quillback;\
		clownfish medusafish Atlantic trout? Gouramie bichir frilled shark\
		dragonet spiny dogfish cuckoo wrasse.</p>'}
}