$(document).ready(function() {
	$('body').on('click', '.sidebar #collapse_serials table>tbody>tr', function(e) {
		displayDummyText();
	});
	$('body').on('click','.main .serial table>tbody>tr', function(e) {
		displayDummyEpisode();
	});
});

function display_serials() {
	$.get('templates/serials.html', function(template) {
	    var rendered = Mustache.render(template, {});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content serials');
	    displayContent(contentElement, rendered);
	  });
}

function displaySerial(author, title, description) {
	$.get('templates/serial.html', function(template) {
	    var rendered = Mustache.render(template, {"author": author, "title": title, "description": description});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content serial');
	    displayContent(contentElement, rendered);
	  });
}

function addEpisode() {
	$('#modal').addClass("edit-episode");
	$('#editor_label').html('Add episode');
	$('#modal').modal('show');
}

function saveEpisode(title, content) {
	//TODO validation
	displayEpisode('dummy_user', title, content);
	$('#modal').modal('hide');
}

function addSerial() {
	$('#modal').addClass("edit-serial");
	$('#editor_label').html('Add serial');
	$('#modal').modal('show');
}

function saveSerial(title, description) {
	//TODO validation
	displaySerial('dummy_user', title, description);
	$('#modal').modal('hide');
}

function displayEpisode(author, title, content) {
	$.get('templates/episode.html', function(template) {
	    var rendered = Mustache.render(template, {"author": author, "title": title, "content": content});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content episode');
	    displayContent(contentElement, rendered);
	  });
}
function displayDummySerial() {
	displaySerial(generateDummySerial(123));
}
function displayDummyEpisode() {
	displayEpisode('kiloster', 'Razorback sucker', '<p>Combtooth blenny houndshark clown triggerfish paperbone,\
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
			dragonet spiny dogfish cuckoo wrasse.</p>');
}
function generateDummySerial(id) {
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