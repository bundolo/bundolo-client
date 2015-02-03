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
	
	//click on slider toggle
	$('body').on('click', '#slider-toggle', function(e) {
		$('.slider').toggleClass('fixed');
		$(this).find('i').toggleClass('fa-angle-double-down fa-angle-double-up');
		if ($('.slider.fixed').length) {
	    	displaySliderFixed();
	    } else {
	    	$('.slider>ul>li.active>a').click();
	    }
	});
});

function displaySlider() {
	$.get("/templates/slider" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, {
	    	"tabs": [
			    { "title": "komentari", "id" : "comments", "icon" : "comment-o", "active": true, "plain": true },
			    { "title": "tekstovi", "id" : "texts", "icon" : "file-text-o" },
			    { "title": "serije", "id" : "serials", "icon" : "book" },
			    { "title": "autori", "id" : "authors", "icon" : "user" },
			    { "title": "vesti", "id" : "announcements", "icon" : "bullhorn" },
			    { "title": "diskusije", "id" : "topics", "icon" : "comments-o", "plain": true },
			    { "title": "konkursi", "id" : "contests", "icon" : "eye" },
			    { "title": "linkovi", "id" : "connections", "icon" : "link" },
			  ]
		});
	    $(".slider").html(rendered);
	    if ($('.slider.fixed').length) {
	    	displaySliderFixed();
	    } else {
	    	displaySlide('comments');
	    }
	  });
}

function displaySlide(type) {
	$.getJSON(rootPath + restRoot + "/" + type, { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function( data ) {
		  $.get("/templates/slide_"+type+"-" + version + ".html", function(template) {			  
			  var rendered = Mustache.render(template, { "id": type, "slides": adjustData(data, type), "escapeUrl": escapeUrl, "timestampDate": timestampDate});
			  $(".slider #"+type+"-carousel>div").html(rendered);
		  });
	});
}

function refreshSliderIfNeeded(type) {
	var slide = $(".slider #"+type+"_tab.active");
	if (slide.length) {
		displaySlide(type);
	}
}

function displaySliderFixed() {
	$.getJSON(rootPath + restRoot + "/texts", { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function(dataTexts) {
		$.getJSON(rootPath + restRoot + "/comments", { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function(dataComments) {
			$.getJSON(rootPath + restRoot + "/topics", { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function(dataTopics) {
				$.get("/templates/slider_fixed" + "-" + version + ".html", function(template) {
				    var rendered = Mustache.render(template, { "texts" : adjustData(dataTexts, "texts"), "comments" : adjustData(dataComments, "comments"), "topics" : adjustData(dataTopics, "topics"), "escapeUrl": escapeUrl, "timestampDate": timestampDate
				    	});
				    $(".tabs-plain").html(rendered);
				});
			});
		});
	});	
}

function adjustData(data, type) {
	for (index in data) {
		  //since mustache does not support accessing array index in template, we have to add it manually
		  data[index].index = index;
		  if (index == 0) {
			  data[index].active_slide = true;
		  }
		  
		  //there is no switch in mustache so we are setting variables
		  if (type == 'comments') {
			  switch(data[index].parentContent.kind) {
			    case 'text':
			    	data[index].parentKind = 'tekst';
			    	data[index].parentLinkText = data[index].parentContent.authorUsername + " - " + data[index].parentContent.name;
			    	data[index].parentLinkUrl = "text/" + data[index].parentContent.authorUsername + "/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'episode':
			    	data[index].parentKind = 'nastavak';
			    	data[index].parentLinkText = data[index].parentContent.authorUsername + " - " + data[index].parentContent.name;
			    	data[index].parentLinkUrl = "text/" + data[index].parentContent.authorUsername + "/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'episode_group':
			    	data[index].parentKind = 'priču u nastavcima';
			    	data[index].parentLinkText = data[index].parentContent.name;
			    	data[index].parentLinkUrl = "serial/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'connection_description':
			    	data[index].parentKind = 'link';
			    	data[index].parentLinkText = data[index].parentContent.name;
			    	data[index].parentLinkUrl = "connection/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'contest_description':
			    	data[index].parentKind = 'konkurs';
			    	data[index].parentLinkText = data[index].parentContent.name;
			    	data[index].parentLinkUrl = "contest/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'page_description':
			    	data[index].parentKind = 'stranicu';
			    	data[index].parentLinkText = data[index].parentContent.text;
			    	data[index].parentLinkUrl = "";
			    	var contentUrl = data[index].parentContent.name;
			    	contentUrl = contentUrl.replace(/ /g, '~').toLowerCase();
			    	if (contentUrl != 'home') {
			    		data[index].parentLinkUrl += contentUrl;
			    	}
			        break;
			    case 'news':
			    	data[index].parentKind = 'vest';
			    	data[index].parentLinkText = data[index].parentContent.name;
			    	data[index].parentLinkUrl = "announcement/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
			    case 'forum_group':
			    	//forum group comments are not enabled 
			    	data[index].parentKind = 'kategoriju na forumu';
			        break;
			    case 'user_description':
			    	data[index].parentKind = 'autora';
			    	data[index].parentLinkText = data[index].parentContent.authorUsername;
			    	data[index].parentLinkUrl = "author/" + data[index].parentContent.authorUsername;
			        break;
			    case 'item_list_description':
			    	data[index].parentKind = 'izbor';
			    	data[index].parentLinkText = data[index].parentContent.name;
			    	data[index].parentLinkUrl = "item_list/" + data[index].parentContent.name.replace(/ /g, '~');
			        break;
	    		}
			  data[index].text = sanitizeRuntime(data[index].text);
		  } else if (type == 'authors') {
			  switch(data[index].gender) {
	    		case 'male':
	    			data[index].gender = 'muški';
	    			break;
	    		case 'female':
	    			data[index].gender = 'ženski';
	    			break;
	    		case 'other':
	    			data[index].gender = 'x';
	    			break;
	    	}
		  }
	  }
	return data;
}