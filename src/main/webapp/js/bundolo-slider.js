$(document).ready(function() {
	displaySlider();
});

function displaySlider() {
	$.get('templates/slider.html', function(template) {
	    var rendered = Mustache.render(template, {
	    	"tabs": [
			    { "title": "Overview", "id" : "overview", "icon" : "flag", "active": true },
			    { "title": "Texts", "id" : "texts", "icon" : "file-text-o" },
			    { "title": "Serials", "id" : "serials", "icon" : "book" },
			    { "title": "Authors", "id" : "authors", "icon" : "user" },
			    { "title": "Announcements", "id" : "announcements", "icon" : "bullhorn", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			    { "title": "Forum", "id" : "topics", "icon" : "comments-o", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			    { "title": "Contests", "id" : "contests", "icon" : "eye" },
			    { "title": "Connections", "id" : "connections", "icon" : "link" },
			  ]
		});
	    $(".slider").html(rendered);
	    //TODO assign event handlers if any
	  });
}

function displaySlide(id) {
	$.getJSON( "http://localhost/"+id, { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function( data ) {
		  $.get("templates/slide_"+id+".html", function(template) {
			  for (index in data) {
				  data[index].index = index;
				  if (index == 0) {
					  data[index].active_slide = true;
				  }
			  }
			  var rendered = Mustache.render(template, { "id": id, "slides": data });
			  $(".slider #"+id+"-carousel>div").html(rendered);
		  });
	});
}