$(document).ready(function() {
	displaySidebar();
	//clicks on entries in tables
	$('body').on('click', '#sidebarAccordion>li .panel-collapse table>tbody>tr', function(e) {
		var elementId = $(this).attr('id');
		var itemType = elementId.substr(0, elementId.indexOf('_'));
		var itemId = elementId.substr(itemType.length + 1);
		$.address.value(rootFolder+itemType+"/" + itemId);
	});
	//clicks on column headers
	$('body').on('click', '#sidebarAccordion>li .panel-collapse table>thead>tr>th', function(e) {
		var elementId = $(this).attr('id');
		var itemType = elementId.substr(0, elementId.indexOf('_'));
		var columnName = elementId.substr(itemType.length + 8);
		if (($(this).hasClass("asc")) || ($(this).hasClass("desc")))  {
			$(this).toggleClass("asc desc");
		} else {
			$('#sidebarAccordion>li #collapse_'+itemType+' table>thead>tr>th').removeClass("asc desc");
			$(this).toggleClass("asc");
		}
		displaySidebarAccordion(itemType, columnName + ',' + $(this).attr('class'), getFilterString(itemType));
	});
	//changing text in filter input fields
	$('body').on('input', '#sidebarAccordion>li .panel-collapse table>thead>tr>td>input', function(e) {
		window.clearTimeout($(this).data("timeout"));
		var thiz = $(this);
	    $(this).data("timeout", setTimeout(function () {
	    	var collapseId = thiz.closest('.panel-collapse').attr('id');
			var itemType = collapseId.substr(9);
			displaySidebarAccordion(itemType, getOrderString(itemType), getFilterString(itemType));
	    }, 500));
		
	});
	//changing selection in category combo box
	$('body').on('change', '#sidebarAccordion>li>.panel-heading>select', function(e) {
		window.clearTimeout($(this).data("timeout"));
		var thiz = $(this);
	    $(this).data("timeout", setTimeout(function () {
	    	var collapseId = thiz.parent().parent().find('.panel-collapse').attr('id');
			var itemType = collapseId.substr(9);
			displaySidebarAccordion(itemType, getOrderString(itemType), getFilterString(itemType));
	    }, 500));
		
	});
});

function getOrderString(type) {
	var result = '';
	$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>th').each(function() {
		if ($(this).attr('class')) {
			var elementId = $(this).attr('id');
			var columnName = elementId.substr(type.length + 8);
			if (result != '') {
				result += ',';
			}
			result += columnName + ',' + $(this).attr('class');
		}
	});
	return result;
}

function getFilterString(type) {
	var result = '';
	$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>th').each(function() {
		var tr = $(this).parent();
		var columnIndex = tr.children().index($(this));
		var filterValue = tr.next().children().eq(columnIndex).find('input').val();
		if (filterValue) {
			var elementId = $(this).attr('id');
			var columnName = elementId.substr(type.length + 8);
			if (result != '') {
				result += ',';
			}
			result += columnName + ',' + filterValue;
		}
	});
	var categorySelect = $('#sidebarAccordion>li #collapse_'+type).parent().find('.panel-heading>select');
	if (categorySelect.length && categorySelect.val()) {
		if (result != '') {
			result += ',';
		}
		result += 'group,' + categorySelect.val();
	}
	return result;
}

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
			 			    { "title": "tekstovi", "id" : "texts", "icon" : "file-text-o", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}] },
			 			    { "title": "serije", "id" : "serials", "icon" : "book", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}] },
			 			    { "title": "autori", "id" : "authors", "icon" : "user", "columns" : [{"column_title" : "korisničko ime", "column_name" : "author"}, {"column_title" : "opis", "column_name" : "description"}, {"column_title" : "registracija", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}] },
			 			    { "title": "vesti", "id" : "announcements", "icon" : "bullhorn", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}] },
			 			    { "title": "diskusije", "id" : "topics", "icon" : "comments-o", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}], "categories" : [{"title" : "književnost", "id" : "književnost"}, {"title" : "bundolo", "id" : "bundolo"}, {"title" : "razno", "id" : "razno"}, {"title" : "predlozi", "id" : "predlozi"}, {"title" : "arhiva", "id" : "arhiva"} ] },
			 			    { "title": "konkursi", "id" : "contests", "icon" : "eye", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}] },
			 			    { "title": "linkovi", "id" : "connections", "icon" : "link", "columns" : [{"column_title" : "naslov", "column_name" : "title"}, {"column_title" : "autor", "column_name" : "author"}, {"column_title" : "objavljivanje", "column_name" : "date", "column_order" : "desc"}, {"column_title" : "aktivnost", "column_name" : "activity"}], "categories" : [{"title" : "književnost", "id" : "književnost"}, {"title" : "kultura", "id" : "kultura"}, {"title" : "alternativni strip", "id" : "alternativni strip"}, {"title" : "online magazini", "id" : "online magazini"}, {"title" : "alternativna kultura", "id" : "alternativna kultura"} ] },
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

function displaySidebarAccordion(type, orderBy, filterBy) {
	//console.log("type: " + type + ", orderBy: " + orderBy +", filterBy: "+ filterBy);
	if (typeof orderBy === 'undefined' || orderBy == '') {
		orderBy = 'date,desc';
		$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>th').removeClass("asc desc");
		$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>#'+type+'_column_date').addClass('desc');
	}	
	filterBy = typeof filterBy !== 'undefined' ? filterBy : '';
	var table = $('.sidebar #collapse_'+type+' table');
	table.addClass('hide');
	var itemCounter = 0;
	var itemInitial = 25;
	var itemAdditional = 10;
	$.get('/templates/sidebar_'+type+'.html', function(template) {
		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemInitial -1), "orderBy": orderBy, "filterBy": filterBy}, function( data ) {
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
			tableBody.unbind('scroll');
			tableBody.bind('scroll', function() {
		    	if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
		    		itemCounter = tableBody.find('tr').length;
		    		//console.log("start: " + itemCounter);
		    		//console.log("end: " + (itemCounter + itemAdditional -1));
		    		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemAdditional -1), "orderBy": orderBy, "filterBy": filterBy}, function( additional_data ) {
		    			var rendered_rows = Mustache.render(template, {"items": additional_data, "escapeUrl": escapeUrl});
		    			tableBody.append(rendered_rows);
		    		});
		        }
		    });
		});		
	});
}