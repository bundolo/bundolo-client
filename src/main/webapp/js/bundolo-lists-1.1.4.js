$(document).ready(function() {
	//clicks on column headers
	$('body').on('click', 'table.infinite>thead>tr>th', function(e) {
		var elementId = $(this).attr('id');
		var itemType = elementId.substr(0, elementId.indexOf('_'));
		var columnName = elementId.substr(itemType.length + 8);
		if (($(this).hasClass("asc")) || ($(this).hasClass("desc")))  {
			$(this).toggleClass("asc desc");
		} else {
			$('table.infinite>thead>tr>th').removeClass("asc desc");
			if ('date' == columnName || 'activity' == columnName || 'lastLoginDate' == columnName) {
				$(this).toggleClass("desc");
			} else {
				$(this).toggleClass("asc");
			}
		}
		var orderByDirection = $(this).hasClass("desc") ? "desc" : "asc";
		displayListItems(itemType, columnName + ',' + orderByDirection, getFilterString(itemType));
	});
	//changing text in filter input fields
	$('body').on('input', 'table.infinite>thead>tr>td>input', function(e) {
		window.clearTimeout($(this).data("timeout"));
		var thiz = $(this);
	    $(this).data("timeout", setTimeout(function () {
	    	var collapseId = $('table.infinite').attr('id');
			var itemType = collapseId.substr(5);
			displayListItems(itemType, getOrderString(itemType), getFilterString(itemType), thiz);
	    }, 500));
	});
	//TODO
	//changing selection in category combo box
//	$('body').on('change', mainContentPath + ' select', function(e) {
//		window.clearTimeout($(this).data("timeout"));
//		var thiz = $(this);
//	    $(this).data("timeout", setTimeout(function () {
//	    	var collapseId = thiz.parent().parent().find('.panel-collapse').attr('id');
//			var itemType = collapseId.substr(9);
//			displayListItems(itemType, getOrderString(itemType), getFilterString(itemType));
//	    }, 500));
//	});
});

function displayList(type, orderBy, filterBy, lastModified) {
	$.get(rootPath + "/templates/"+type+"-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {});
		var mainContent = $(mainContentPath);
		displayContent(mainContent, rendered, null, null, type);
		displayListItems(type, orderBy, filterBy, lastModified);
	});
}

function displayListItems(type, orderBy, filterBy, lastModified) {
	if (typeof orderBy === 'undefined' || orderBy == '') {
		orderBy = getOrderString(type);
		var orderByArray = orderBy.split(",");
		$('table.infinite>thead>tr>th').removeClass("asc desc");
		$('table.infinite>thead>tr>#'+type+'_column_'+orderByArray[0]).addClass(orderByArray[1]);
	}
	filterBy = typeof filterBy !== 'undefined' ? filterBy : '';
	//TODO
	var table = $('.sidebar #collapse_'+type+' table');
	table.addClass('hide');
	var itemCounter = 0;
	var itemInitial = 25;
	var itemAdditional = 10;
	$.get("/templates/"+type+"_rows-" + version + ".html", function(template_rows) {
		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemInitial -1), "orderBy": orderBy, "filterBy": filterBy}, function( data ) {
			var mainContent = $(mainContentPath);
			var tableBody = mainContent.find("table.infinite>tbody");
			var rendered_rows = Mustache.render(template_rows, {"items": data, "escapeUrl": escapeUrl, "timestampDate": timestampDate, "trimLong": trimLong});
			tableBody.html(rendered_rows);
			var tableWidth = mainContent.find("table.infinite").width();
			tableBody.width(tableWidth);
			var columnWidth = mainContent.find("table.infinite>thead>tr>th").width();
			tableBody.find('td').width(columnWidth);
			tableBody.unbind('scroll');
			tableBody.bind('scroll', function() {
		    	if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
		    		itemCounter = tableBody.find('tr').length;
		    		$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemAdditional -1), "orderBy": orderBy, "filterBy": filterBy}, function( additional_data ) {
		    			var rendered_rows = Mustache.render(template_rows, {"items": additional_data, "escapeUrl": escapeUrl, "timestampDate": timestampDate, "trimLong": trimLong});
		    			tableBody.append(rendered_rows);
		    		});
		        }
		    });
			if (lastModified) {
				lastModified.focus();
			}
		});
	});
}

function getOrderString(type) {
	var result = '';
	$(mainContentPath).find("table.infinite>thead>tr>th").each(function() {
		if ($(this).hasClass("desc") || $(this).hasClass("asc")) {
			var elementId = $(this).attr('id');
			var columnName = elementId.substr(type.length + 8);
			if (result != '') {
				result += ',';
			}
			var orderByDirection = $(this).hasClass("desc") ? "desc" : "asc";
			result += columnName + ',' + orderByDirection;
		}
	});
	return result;
}

function getFilterString(type) {
	var result = '';
	$(mainContentPath).find("table.infinite>thead>tr>th").each(function() {
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
	//TODO
	var categorySelect = $('#sidebarAccordion>li #collapse_'+type).parent().find('.panel-heading>select');
	if (categorySelect.length && categorySelect.val()) {
		if (result != '') {
			result += ',';
		}
		result += 'group,' + categorySelect.val();
	}
	return result;
}