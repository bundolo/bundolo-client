$(document).ready(function() {
	$('body').on('click', '.sidebar #collapse_announcements table>tbody>tr', function(e) {
		displayAnnouncement($(this).attr('id').substr("announcements".length));
	});
});

function addAnnouncement() {
	$('#modal').addClass("edit-announcement");
	$('#editor_label').html('Add announcement');
	$('#modal').modal('show');
}

function saveAnnouncement(title, content) {
	//TODO validation
	displayAnnouncement({'author' : 'dummy_user', 'title' : title, 'content' : content});
	$('#modal').modal('hide');
}

function displayAnnouncement(id) {
	$.get('templates/announcement.html', function(template) {
		$.getJSON( "http://localhost/announcement/"+id, function( data ) {
		    var rendered = Mustache.render(template, data);
		    var contentElement = $('.main>.jumbotron>.content');
		    displayContent(contentElement, rendered);
		});
	});
}
function displayDummyAnnouncement() {
	displayAnnouncement(generateDummyAnnouncement(456));
}
function generateDummyAnnouncement(id) {
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