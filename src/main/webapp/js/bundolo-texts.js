$(document).ready(function() {
	$('body').on('click', '.sidebar #collapse_texts table>tbody>tr', function(e) {
		displayDummyText();
	});
});

function addText() {
	$('#modal').addClass("edit-text");
	$('#editor_label').html('Add text');
	$('#modal').modal('show');
}

function saveText(title, description, content) {
	//TODO validation
	displayText({'author' : 'dummy_user', 'title' : title, 'description' : description, 'content' : content});
	$('#modal').modal('hide');
}

function displayText(text) {
	$.get('templates/text.html', function(template) {
	    var rendered = Mustache.render(template, text);
	    var contentElement = $('.main>.jumbotron>.content');
	    displayContent(contentElement, rendered);
	});
}
function displayDummyText() {
	displayText(generateDummyText(123));
}

function generateDummyText(id) {
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