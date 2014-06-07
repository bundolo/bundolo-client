$(document).ready(function() {
	displaySlider();
});

function displaySlider() {
	$.get('/templates/slider.html', function(template) {
	    var rendered = Mustache.render(template, {
	    	"tabs": [
			    { "title": "Overview", "id" : "overview", "icon" : "flag", "active": true },
			    { "title": "Texts", "id" : "texts", "icon" : "file-text-o" },
			    { "title": "Serials", "id" : "serials", "icon" : "book" },
			    { "title": "Authors", "id" : "authors", "icon" : "user" },
			    { "title": "Announcements", "id" : "announcements", "icon" : "bullhorn" },
			    { "title": "Forum", "id" : "topics", "icon" : "comments-o" },
			    { "title": "Contests", "id" : "contests", "icon" : "eye" },
			    { "title": "Connections", "id" : "connections", "icon" : "link" },
			  ]
		});
	    $(".slider").html(rendered);
	    //TODO assign event handlers if any
	  });
}

function displaySlide(type) {
	$.getJSON(rootPath + restRoot + "/" + type, { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function( data ) {
		  $.get("/templates/slide_"+type+".html", function(template) {
			  for (index in data) {
				  data[index].index = index; //since mustache does not support accessing array index in template, we have to add it manually
				  if (index == 0) {
					  data[index].active_slide = true;
				  }
			  }
			  var rendered = Mustache.render(template, { "id": type, "slides": data });
			  $(".slider #"+type+"-carousel>div").html(rendered);
		  });
	});
}