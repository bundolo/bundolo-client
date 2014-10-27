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
	$.get("/templates/slider" + "-" + version + ".html", function(template) {
	    var rendered = Mustache.render(template, {
	    	"tabs": [
			    { "title": "komentari", "id" : "comments", "icon" : "comment-o", "active": true },
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
	    displaySlide('comments');
	  });
}

function displaySlide(type) {
	$.getJSON(rootPath + restRoot + "/" + type, { "start": "0", "end": "9", "orderBy": "date,desc", "filterBy": ""}, function( data ) {
		  $.get("/templates/slide_"+type+"-" + version + ".html", function(template) {
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
					    	data[index].parentLinkUrl = rootPath+"/text/" + data[index].parentContent.authorUsername + "/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'episode':
					    	data[index].parentKind = 'nastavak';
					    	data[index].parentLinkText = data[index].parentContent.authorUsername + " - " + data[index].parentContent.name;
					    	data[index].parentLinkUrl = rootPath+"/text/" + data[index].parentContent.authorUsername + "/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'episode_group':
					    	data[index].parentKind = 'priču u nastavcima';
					    	data[index].parentLinkText = data[index].parentContent.name;
					    	data[index].parentLinkUrl = rootPath+"/serial/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'connection_description':
					    	data[index].parentKind = 'link';
					    	data[index].parentLinkText = data[index].parentContent.name;
					    	data[index].parentLinkUrl = rootPath+"/connection/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'contest_description':
					    	data[index].parentKind = 'konkurs';
					    	data[index].parentLinkText = data[index].parentContent.name;
					    	data[index].parentLinkUrl = rootPath+"/contest/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'page_description':
					    	data[index].parentKind = 'stranicu';
					    	data[index].parentLinkText = data[index].parentContent.text;
					    	data[index].parentLinkUrl = rootPath;
					    	var contentUrl = data[index].parentContent.name;
					    	contentUrl = contentUrl.replace(/ /g, '~').toLowerCase();
					    	if (contentUrl != 'home') {
					    		data[index].parentLinkUrl += "/" + contentUrl;
					    	}
					        break;
					    case 'news':
					    	data[index].parentKind = 'vest';
					    	data[index].parentLinkText = data[index].parentContent.name;
					    	data[index].parentLinkUrl = rootPath+"/announcement/" + data[index].parentContent.name.replace(/ /g, '~');
					        break;
					    case 'forum_group':
					    	//forum group comments are not enabled 
					    	data[index].parentKind = 'kategoriju na forumu';
					        break;
					    case 'user_description':
					    	data[index].parentKind = 'autora';
					    	data[index].parentLinkText = data[index].parentContent.authorUsername;
					    	data[index].parentLinkUrl = rootPath+"/author/" + data[index].parentContent.authorUsername;
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
			  var rendered = Mustache.render(template, { "id": type, "slides": data, "escapeUrl": escapeUrl, "timestampDate": timestampDate});
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