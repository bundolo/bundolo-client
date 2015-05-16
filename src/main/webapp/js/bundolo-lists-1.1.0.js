function displayList(type, orderBy, filterBy, lastModified) {
	if (typeof orderBy === 'undefined' || orderBy == '') {
//		orderBy = getOrderString(type);
//		var orderByArray = orderBy.split(",");
//		$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>th').removeClass("asc desc");
//		$('#sidebarAccordion>li #collapse_'+type+' table>thead>tr>#'+type+'_column_'+orderByArray[0]).addClass(orderByArray[1]);
	}
	filterBy = typeof filterBy !== 'undefined' ? filterBy : '';
	var table = $('.sidebar #collapse_'+type+' table');
	table.addClass('hide');
	var itemCounter = 0;
	var itemInitial = 25;
	var itemAdditional = 10;
	$.get("/templates/"+type+"-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {});
		var mainContent = $(mainContentPath);
		displayContent(mainContent, rendered);
		$.get("/templates/"+type+"_rows-" + version + ".html", function(template_rows) {
			$.getJSON(rootPath + restRoot + "/" + type, { "start": itemCounter, "end": (itemCounter + itemInitial -1), "orderBy": orderBy, "filterBy": filterBy}, function( data ) {
				var tableBody = mainContent.find("table>tbody");
				var rendered_rows = Mustache.render(template_rows, {"items": data, "escapeUrl": escapeUrl, "timestampDate": timestampDate, "trimLong": trimLong});
				tableBody.html(rendered_rows);
				var tableWidth = mainContent.find("table").width();
				tableBody.width(tableWidth);
				var columnWidth = mainContent.find("table>thead>tr>th").width();
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
	});
}