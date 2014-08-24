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
	    //TODO assign event handlers if any
	  });
}

function displaySlide(type) {
	$.getJSON(rootPath + restRoot + "/" + type, { "start": "0", "end": "4", "orderBy": "date,desc", "filterBy": ""}, function( data ) {
		  $.get("/templates/slide_"+type+".html", function(template) {
			  for (index in data) {
				  //since mustache does not support accessing array index in template, we have to add it manually
				  data[index].index = index;
				  if (index == 0) {
					  data[index].active_slide = true;
				  }
				  
				  //there is no switch in mustache so we are setting variables
				  if (type == 'comments') {
					  //console.log(data[index].parentContent.kind);
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
					    	var contentName = data[index].parentContent.name;
					    	data[index].parentLinkText = contentName;
					    	data[index].parentLinkUrl = rootPath;
					    	contentName = contentName.replace(/ /g, '~').toLowerCase();
					    	if (contentName != 'home') {
					    		data[index].parentLinkUrl += "/" + contentName;
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
					  //console.log(JSON.stringify(data[index])); 
				  }
			  }
			  var escapeUrl = function () {
					return function(val, render) {
					    return render(val).replace(/ /g, '~');
					};
				};
			  var rendered = Mustache.render(template, { "id": type, "slides": data, "escapeUrl": escapeUrl });
			  $(".slider #"+type+"-carousel>div").html(rendered);
		  });
	});
}