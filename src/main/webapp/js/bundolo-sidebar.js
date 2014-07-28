$(document).ready(function() {
	displaySidebar();
	$('body').on('click', '#sidebarAccordion>li .panel-collapse table>tbody>tr', function(e) {
		var elementId = $(this).attr('id');
		var itemType = elementId.substr(0, elementId.indexOf('_'));
		var itemId = elementId.substr(itemType.length + 1);
		$.address.value(rootFolder+itemType+"/" + itemId);
	});
});

function preventSidebarToggle(element, event) {
	var thisAccordion = element.closest('.panel');
	if (thisAccordion.hasClass('active')) {
		event.stopPropagation();
	}
}

function displaySidebar() {
	$.get('/templates/sidebar.html', function(template) {
	    var rendered = Mustache.render(template, {
			  "collapsibles": [
			 			    { "title": "Texts", "id" : "texts", "icon" : "file-text-o", "columns" : ["author", "title", "date", "last_activity"] },
			 			    { "title": "Serials", "id" : "serials", "icon" : "book", "columns" : ["author", "title", "date", "last_activity"] },
			 			    { "title": "Authors", "id" : "authors", "icon" : "user", "columns" : ["author", "title", "date", "last_activity"] },
			 			    { "title": "Announcements", "id" : "announcements", "icon" : "bullhorn", "columns" : ["author", "title", "date", "last_activity"] },
			 			    { "title": "Forum", "id" : "topics", "icon" : "comments-o", "columns" : ["author", "title", "date", "last_activity"], "categories" : [{"title" : "Literature", "id" : "literature"}, {"title" : "Bundolo", "id" : "bundolo"}, {"title" : "Various", "id" : "various"}, {"title" : "Suggestions", "id" : "suggestions"}, {"title" : "Archive", "id" : "archive"} ] },
			 			    { "title": "Contests", "id" : "contests", "icon" : "eye", "columns" : ["author", "title", "date", "last_activity"] },
			 			    { "title": "Connections", "id" : "connections", "icon" : "link", "columns" : ["author", "title", "date", "last_activity"], "categories" : [{"title" : "Literature", "id" : "literature"}, {"title" : "Art", "id" : "art"}, {"title" : "Alternative comics", "id" : "comics"}, {"title" : "Online magazines", "id" : "magazines"}, {"title" : "Underground", "id" : "underground"} ] },
			 			  ]
			 			});
	    $(".sidebar").html(rendered);
	    //TODO assign event handlers if any
		$('#sidebarAccordion').on('show.bs.collapse', function(e) {
			$(e.target).parent('.panel-default')
					.addClass('active');
			if (!$('.row-offcanvas.active').length) {
				$('.row-offcanvas').addClass('active');
			}
		});
		$('#sidebarAccordion').on('shown.bs.collapse', function(e) {
			$(e.target).parent('.panel-default')
					.addClass('active');
			if (!$('.row-offcanvas.active').length) {
				$('.row-offcanvas').addClass('active');
			}
		});
		$('#sidebarAccordion').on('hidden.bs.collapse', function(e) {
			$(this).find('.panel-default').not($(e.target)).removeClass('active');			
			if (!$('.panel-default.active').length) {
				$('.row-offcanvas').removeClass('active');
			}
		});
		$('.sidebar input[type="search"]').focus(function(event) {
			preventSidebarToggle($(this), event);
		});
		$('.sidebar input[type="search"]').click(function(event) {
			preventSidebarToggle($(this), event);
		});
	  });
}

function displaySidebarAccordion(type) {
	var table = $('.sidebar #collapse_'+type+' table');
	table.addClass('hide');
	var itemCounter = 0;
	var itemInitial = 25;
	var itemAdditional = 10;
	$.get('/templates/sidebar_'+type+'.html', function(template) {
		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemInitial -1), "orderBy": "date,desc", "filterBy": ""}, function( data ) {
			var escapeUrl = function () {
				return function(val, render) {
				    return render(val).replace(/ /g, '~');
				};
			};
			//console.log(JSON.stringify(data));
			var rendered = Mustache.render(template, {"items": data, "escapeUrl": escapeUrl});
			var tableBody = $('.sidebar #collapse_'+type+' tbody');
			tableBody.html(rendered);
			 $('.sidebar #collapse_'+type+' .fa-spin').addClass('hide');;
			table.removeClass('hide');
			tableBody.bind('scroll', function() {
		    	if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
		    		itemCounter = tableBody.find('tr').length;
		    		console.log("start: " + itemCounter);
		    		console.log("end: " + (itemCounter + itemAdditional -1));
		    		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemAdditional -1), "orderBy": "date,desc", "filterBy": ""}, function( additional_data ) {
		    			var rendered_rows = Mustache.render(template, {"items": additional_data, "escapeUrl": escapeUrl});
		    			tableBody.append(rendered_rows);
		    		});
		        }
		    });
		});		
	});
}