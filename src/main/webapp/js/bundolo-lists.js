$(document).ready(function() {
	//clicks on column headers
	$('body').on('click', 'table.infinite>thead>tr>th', function(e) {
		var elementId = $(this).attr('id');
		if (elementId && "author_interactions_column_comments_delta" != elementId && "author_interactions_column_rating_delta" != elementId) {
			var itemType = elementId.substr(0, elementId.indexOf('_column'));
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
			var path = $(this).closest('table').attr('data-path');
			var orderByDirection = $(this).hasClass("desc") ? "desc" : "asc";
			displayListItems(itemType, columnName + ',' + orderByDirection, getFilterString(itemType), null, path);
		}
	});
	//changing text in filter input fields
	$('body').on('input', 'table.infinite>thead>tr>td>input', function(e) {
		window.clearTimeout($(this).data("timeout"));
		var thiz = $(this);
	    $(this).data("timeout", setTimeout(function () {
	    	var tableElement = $('table.infinite');
	    	var collapseId = tableElement.attr('id');
			var itemType = collapseId.substr(5);
			var path = tableElement.attr('data-path');
			displayListItems(itemType, getOrderString(itemType), getFilterString(itemType), thiz, path);
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

	//resizing table requires width adjustment to align header with columns
	$(window).resize(function(e){
		var mainContent = $(mainContentPath);
		if (mainContent.length) {
			var tableElement = mainContent.find("table.infinite");
			if (tableElement.length) {
				var tableBody = tableElement.find("tbody");
				tableBody.width(tableElement.width());
				tableElement.find("thead>tr>th").each(function(index) {
					tableBody.find('td').eq(index).width($(this).width());
				});
			}
		}
	});
});

function displayList(type, orderBy, filterBy, lastModified, path, adjustHeaders) {
	$.get(rootPath + "/templates/"+type+"-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {});
		var mainContent = $(mainContentPath);
		displayContent(mainContent, rendered, null, null, type);
		if (adjustHeaders) {
			//if passed orderBy in url, we need to adjust column headers to reflect it
			var orderByArray = orderBy.split(",");
			$('table.infinite>thead>tr>th').removeClass("asc desc");
			$('table.infinite>thead>tr>#'+type+'_column_'+orderByArray[0]).addClass(orderByArray[1]);
		}
		displayListItems(type, orderBy, filterBy, lastModified, path);
	});
}

function displayListItems(type, orderBy, filterBy, lastModified, path) {
	var mainContent = $(mainContentPath);
	var tableBody = mainContent.find("table.infinite>tbody");
	tableBody.html(spinner);
	if (typeof orderBy === 'undefined' || orderBy == '') {
		orderBy = getOrderString(type);
		var orderByArray = orderBy.split(",");
		$('table.infinite>thead>tr>th').removeClass("asc desc");
		$('table.infinite>thead>tr>#'+type+'_column_'+orderByArray[0]).addClass(orderByArray[1]);
	}
	filterBy = typeof filterBy !== 'undefined' ? filterBy : '';
	if (typeof path === 'undefined' || path == null) {
		if (type == "user_items" || type == "author_interactions") {
			path = '/' + username;
		} else {
			path = '';
		}
	}
	var table = $('.sidebar #collapse_'+type+' table');
	table.addClass('hide');
	var itemCounter = 0;
	var itemInitial = 25;
	var itemAdditional = 10;
	$.get("/templates/"+type+"_rows-" + version + ".html", function(template_rows) {
		$.ajax({
		    url: rootPath + restRoot + "/" + type + path,
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    data: { "start": itemCounter, "end": (itemCounter + itemInitial -1), "orderBy": orderBy, "filterBy": filterBy},
		    success: function(data) {
		    	if (data) {
					if (type == "author_items" || type == "user_items" || type == "author_interactions") {
						for (var i = 0; i < data.length; i++) {
							switch(data[i].kind) {
						    case 'text':
						    	data[i].isEditable = (type == "user_items");
						        break;
						    case 'episode':
						    	data[i].isEditable = (type == "user_items") && ("pending" == data[i].contentStatus || "pending" == data[i].parent.contentStatus);
						        break;
						    case 'item_list_description':
						    	data[i].isEditable = (type == "user_items");
						        break;
						    case 'user_description':
						    	data[i].name = data[i].authorUsername;
						        break;
				    		}
						}
					}
					var rendered_rows = Mustache.render(template_rows, {"items": data, "timestampDate": timestampDate, "trimLong": trimLong, "translate": translate});
					tableBody.html(rendered_rows);
					var tableWidth = mainContent.find("table.infinite").width();
					tableBody.width(tableWidth);
					$(mainContent.find("table.infinite>thead>tr>th")).each(function(index) {
						tableBody.find('td').eq(index).width($(this).width());
					});
					tableBody.unbind('scroll');
					tableBody.bind('scroll', function() {
				    	if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
				    		itemCounter = tableBody.find('tr').length;
				    		$.ajax({
				    		    url: rootPath + restRoot + "/" + type + path,
				    		    type: 'GET',
				    		    dataType: "json",
				    		    contentType: "application/json; charset=utf-8",
				    		    beforeSend: function (xhr) {
				    		        xhr.setRequestHeader ("Authorization", token);
				    		    },
				    		    data: { "start": itemCounter, "end": (itemCounter + itemAdditional -1), "orderBy": orderBy, "filterBy": filterBy},
				    		    success: function(additional_data) {
				    		    	if (additional_data) {
				    		    		if (type == "author_items" || type == "user_items" || type == "author_interactions") {
						    				for (var i = 0; i < additional_data.length; i++) {
												switch(additional_data[i].kind) {
											    case 'text':
											    	additional_data[i].isEditable = (type == "user_items");
											        break;
											    case 'episode':
											    	additional_data[i].isEditable = (type == "user_items") && "pending" == additional_data[i].contentStatus;
											        break;
											    case 'item_list_description':
											    	additional_data[i].isEditable = (type == "user_items");
											        break;
											    case 'user_description':
											    	data[i].name = data[i].authorUsername;
											        break;
									    		}
						    				}
						    			}
						    			var rendered_rows = Mustache.render(template_rows, {"items": additional_data, "timestampDate": timestampDate, "trimLong": trimLong, "translate": translate});
						    			tableBody.append(rendered_rows);
				    		    	} else {
				    		    		displayModal("notification", null, null, "stranica trenutno nije dostupna!");
				    		    	}
				    			},
				    			error: function(textStatus, errorThrown) {
				    				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
				    			}
				    		});
				        }
				    });
					if (lastModified) {
						lastModified.focus();
					}
		    	} else {
		    		displayModal("notification", null, null, "stranica trenutno nije dostupna!");
		    	}
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
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

function resetHistoricalRatings() {
	$.ajax({
		url: rootPath + restRoot + "/reset_historical/" + slug,
		type: "POST",
		data: {},
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", token);
		},
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		complete: function (xhr, ajaxOptions, thrownError) {
			handlingForm = false;
			if (xhr.status == 200) {
				loadFromAddress();
			} else if (xhr.status == 400) {
				displayModal("notification", null, null, xhr.responseText);
			} else {
				displayModal("notification", null, null, "saving_error");
			}
		}
	});
}