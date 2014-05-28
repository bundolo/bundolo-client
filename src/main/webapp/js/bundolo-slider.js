$(document).ready(function() {
	displaySlider();
});

function displaySlider() {
	$.get('templates/slider.html', function(template) {
		$.getJSON( "http://localhost/latest", function( data ) {
			  alert(data);
			});
	    var rendered = Mustache.render(template, {
			  "tabs": [
			 			    { "title": "Overview", "id" : "overview", "icon" : "flag", "active": true, "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ]},
			 			    { "title": "Texts", "id" : "texts", "icon" : "file-text-o", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "Serials", "id" : "serials", "icon" : "book", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "Authors", "id" : "authors", "icon" : "user", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "News", "id" : "news", "icon" : "bullhorn", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "Forum", "id" : "forum", "icon" : "comments-o", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "Contests", "id" : "contests", "icon" : "eye", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			    { "title": "Connections", "id" : "connections", "icon" : "link", "slides" : [{"content" : "Anemonefish murray cod", "index" : "0"}, {"content" : "Anemonefish murray cod", "index" : "1", "active_slide" : true}, {"content" : "Anemonefish murray cod", "index" : "2"}, {"content" : "Anemonefish murray cod", "index" : "3"} ] },
			 			  ]
			 			});
	    $(".slider").html(rendered);
	    //TODO assign event handlers if any
	  });
}