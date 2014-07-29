$(document).ready(function() {
	displaySlider();
	
	//this solves a problem of carousel not showing active item after slide has been shown, hidden and shown again. some event hangs.
	//on tab show we are finding previous tab, its carousel, and cleaning it up.
	$('body').on('show.bs.tab', 'a[data-toggle="tab"]', function(e) {
		var $carousel = $($(e.relatedTarget).attr('href') + ' .carousel');
		if ($carousel) {
			$carousel.carousel("pause").removeData();
		}
	});
		  
		  
});

function displaySlider() {
	$.get('/templates/slider.html', function(template) {
	    var rendered = Mustache.render(template, {
	    	"tabs": [
			    { "title": "komentari", "id" : "overview", "icon" : "comment-o", "active": true },
			    { "title": "tekstovi", "id" : "texts", "icon" : "file-text-o" },
			    { "title": "serije", "id" : "serials", "icon" : "book" },
			    { "title": "autori", "id" : "authors", "icon" : "user" },
			    { "title": "vesti", "id" : "announcements", "icon" : "bullhorn" },
			    { "title": "diskusije", "id" : "topics", "icon" : "comments-o" },
			    { "title": "konkursi", "id" : "contests", "icon" : "eye" },
			    { "title": "linkovi", "id" : "connections", "icon" : "link" },
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