$(document).ready(function() {
});
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

function saveSerial(title, description) {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var serial = {};
	serial.text = $("#edit_description").val();
	serial.name = $("#edit_title").val();

	console.log(JSON.stringify(serial));
	$.ajax({
		  url: rootPath + restRoot + "/serial/" + serial.name,
		  type: "PUT",
		  data: JSON.stringify(serial),
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
				  console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  displaySingleItem('serial', serial.name.replace(/ /g, '~'));
			  } else {
				  alert("saving failed");
			  }
	      },
	      error: function(data) {
	    	  alert("saving failed");
	      },
	      complete: function(data) {
//	    	  console.log("complete: " + JSON.stringify(data));
	      }
		});
}

function displayEpisode(author, title, content) {
	$.get('/templates/episode.html', function(template) {
	    var rendered = Mustache.render(template, {"author": author, "title": title, "content": content});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content episode');
	    displayContent(contentElement, rendered);
	  });
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