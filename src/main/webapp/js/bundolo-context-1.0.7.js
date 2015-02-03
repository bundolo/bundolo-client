var commentParentElement;
var commentParentId;
var rootParentId;
var rootType;
var itemLists;
$(document).ready(function() {
//	$('body').on('click', function(e) {
//		var modalDialog = $('#modal');
//		var contextMenu = $('.context-menu');
//		var targetParents = $(e.target).parents();
//		if ((targetParents.index(modalDialog) == -1) && !modalDialog.hasClass('in') && (targetParents.index(contextMenu) == -1)) {
//            if(contextMenu.is(":visible")) {
//            	contextMenu.hide();
//            }
//        }
//	});
	$(document).mouseup(function (e) {
		var modalDialog = $('#modal');
		var contextMenu = $('.context-menu');
	
	    if (!modalDialog.is(e.target) && modalDialog.has(e.target).length === 0 && !contextMenu.is(e.target) && contextMenu.has(e.target).length === 0) {
	        if(contextMenu.is(":visible")) {
            	contextMenu.hide();
            }
	    }
	});
	
	$('body').on('click', '.save_comment', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveComment();
		}
	});
	
	$('body').on('click', '.root-comment-button', function(e) {
		var parentElement = $('.context-menu>div>div');
		var parentId = parentElement.find(">span").attr('id').substr(8);
		addComment(parentElement, parentId);
	});
	$('body').on('click', '.comment-button', function(e) {
		var parentElement = $(e.target).closest('.comment');
		var parentId = parentElement.find(">span").attr('id').substr(8);
		addComment(parentElement.find('>.panel-collapse>.panel-body>.panel-group>div>div'), parentId);
	});
	
	$('body').on('mouseenter', '.comments-button, .root-comment-button, .comment-button, .rating-select, .item-list-select', function(e) {
		$(this).parent().addClass("hover");
		if ($(this).parent().parent().css("overflow")=="hidden") {
			$(this).parent().parent().addClass("show-overflow");
		}
	});
	$('body').on('mouseleave', '.comments-button, .root-comment-button, .comment-button, .rating-select, .item-list-select', function(e) {
		$(this).parent().removeClass("hover");
		$(this).parent().parent().removeClass("show-overflow");
	});
	$(window).resize(resizer);
	$('body').on('change', '.rating-select', function(e) {
		var ratingId = $(e.target).attr('id').substr(7);
		saveRating(ratingId, $(e.target).val());
	});
	$('body').on('focus', '.item-list-select', function(e) {
		previousItemList = $(e.target).val();
	});
	$('body').on('change', '.item-list-select', function(e) {
		newItemList = $(e.target).val();
		if (newItemList != previousItemList) {
			var parentId = parseInt($(e.target).attr('id').substr(11));
			saveItemInList(parentId, newItemList, previousItemList);
		}
	});
});

function resizer() {
	var contextMenu = $('.context-menu');
	if(contextMenu.is(":visible")) {
    	contextMenu.hide();
    }
}

function setContextMenuPostion(event) {
	var contextMenu = $('.context-menu');
    var mousePosition = {};
    var menuPosition = {};
    var menuDimension = {};
    menuDimension.x = contextMenu.outerWidth();
    menuDimension.y = contextMenu.outerHeight();    
    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;
    if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
    	menuPosition.x = mousePosition.x - menuDimension.x;
    } else {
    	menuPosition.x = mousePosition.x;
    }
    if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
    	menuPosition.y = mousePosition.y - menuDimension.y;
    } else {
    	menuPosition.y = mousePosition.y;
    }
    if (menuPosition.x < 0) {
    	menuPosition.x = 0;
    }
    if (menuPosition.y < 0) {
    	menuPosition.y = 0;
    }
    contextMenu.css({
        display: "block",
        left: menuPosition.x,
        top: menuPosition.y
    });
}

function addContextMenu(parentElement, parentId, parentType) {
	if (username != 'gost') {
		$.getJSON(rootPath + restRoot + "/item_lists", { "start": 0, "end": 0, "orderBy": "date,desc", "filterBy": "author,"+username}, function( data ) {
			if (data) {
				itemLists = data;
				if (itemLists && itemLists.length > 0) {
					var itemListDropdownHtml = '<select class="item-list-select" title="izbor" id="item_lists_' + parentId + '">';
					itemListDropdownHtml += '<option value="">dodaj u izbor</option>';
					var itemListItems;
					var itemInList;
					for (index in data) {
						itemListItems = $.parseJSON(data[index].query);
						itemInList = itemListItems && itemListItems.indexOf(parentId) >= 0;
						itemListDropdownHtml += '<option value="'+index+'"'+(itemInList?' selected="selected"':'')+'>'+data[index].descriptionContent.name+'</option>';
					}
					itemListDropdownHtml += '</select>';
					var itemListDropdown = $(itemListDropdownHtml);
					parentElement.append(itemListDropdown);
					refreshItemListDefault();
				}
			}
		});
		
		$.ajax({
		    url: rootPath + restRoot + "/rating/" + parentId,
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    success: function(data) {
		    	if (data) {
		    		var ratingDropdown = $('<select class="rating-select" title="ocena" id="rating_' + data.ratingId + '">\
		    				<option value="3"'+(data.value==3?' selected="selected"':'')+'>3</option>\
		    				<option value="2"'+(data.value==2?' selected="selected"':'')+'>2</option>\
		    				<option value="1"'+(data.value==1?' selected="selected"':'')+'>1</option>\
		    				<option value="0"'+(data.value==0?' selected="selected"':'')+'>0</option>\
		    				<option value="-1"'+(data.value==-1?' selected="selected"':'')+'>-1</option>\
		    				<option value="-2"'+(data.value==-2?' selected="selected"':'')+'>-2</option>\
		    				<option value="-3"'+(data.value==-3?' selected="selected"':'')+'>-3</option>\
		    			</select>');
		    		parentElement.append(ratingDropdown);
		    	}
			},
			error: function(textStatus, errorThrown) {
				//TODO
			}
		});
	}

	rootType = parentType;
	var commentsButton = $('<span class="fa-stack fa-2x comments-button" id="comments_' + parentId + '">\
			<i class="fa fa-circle fa-stack-2x"></i>\
			<i class="fa fa-comment-o fa-stack-1x fa-inverse"></i>\
			</span>');
	commentsButton.click(function(e) {
		rootParentId = parentId;
		displayComments(rootParentId);
		setContextMenuPostion(e);
        return false;
    });
	commentsButton.attr("title", "komentari");
	parentElement.append(commentsButton);
}

function displayComments(parentId) {
	var contextRootElement = $('.context-menu>div>div');
	contextRootElement.html(spinner);
	$.get(rootFolder+"templates/comments" + "-" + version + ".html", function(template) {
		$.getJSON(rootPath + restRoot + "/parent_comments/" + parentId, function(data) {
			sanitizeRecursive(data);
			var partials = {commentPanel: template};
		    var rendered = Mustache.render(template, {"comments": data}, partials);
		    var rootCommentButton = $('<span title="dodaj komentar" class="fa-stack fa-2x pull-right root-comment-button" id="comment_'+parentId+'">\
					<i class="fa fa-circle fa-stack-2x"></i>\
					<i class="fa fa-plus fa-stack-1x fa-inverse"></i>\
				</span>');
		    contextRootElement.html(rootCommentButton);
		    contextRootElement.append(rendered);
		});
	});
}

function sanitizeRecursive(data) {
	if($.isArray(data) && data.length) {
		for (index in data) {
		  data[index].text = sanitizeRuntime(data[index].text);
		  if(data[index].authorUsername) {
			  data[index].authorText = '<a href="javascript:;" onclick="$.address.value(\'author/' + data[index].authorUsername + '\');">' + data[index].authorUsername + '</a>';
		  } else {
			  data[index].authorText = 'gost';
		  }
		  if(!$.isArray(data[index].comments)) {
			  data[index].comments = [];
		  }
		  sanitizeRecursive(data[index].comments);
		}
	}
}

function addComment(parentElement, parentId) {
	commentParentElement = parentElement;
	commentParentId = parentId;
	editSingleItem('comment');
}

function saveComment() {
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var commentContent = $('#edit_content').val();
	var comment = {};
	comment.text = sanitize(commentContent);
	comment.parentContent = {"contentId" : commentParentId};
	var credentials = $('#edit_credentials').val() == 'logged' ? token : "Basic " + btoa(" : ");
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/comment",
	  type: "POST",
	  data: JSON.stringify(comment),
	  dataType: "json",
	  contentType: "application/json; charset=utf-8",
	  beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", credentials);
	    },
	  headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
				  displayComments(rootParentId);
				  $('#modal').modal('hide');
				  refreshSliderIfNeeded("comments");
				  refreshSidebarIfNeeded(rootType + "s");
				  if (rootType = 'serial') {
					  var reminder = $.address.value().substr(rootFolder.length);
					  var slashPos = reminder.indexOf('/');
					  if (slashPos > 0) {
						  displaySingleItem(reminder.substr(0, slashPos), reminder.substr(slashPos + 1));
					  }
				  }
			  } else {
				  editSingleItem("notification", null, null, data);
			  }
		  } else {
			  editSingleItem("notification", null, null, "saving_error");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "saving_error");
      }
	});
}


function saveRating(ratingId, value) {
	var rating = {};
	rating.value = value;
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/rating/" + ratingId,
	  type: "PUT",
	  data: JSON.stringify(rating),
	  dataType: "json",
	  contentType: "application/json; charset=utf-8",
	  beforeSend: function (xhr) {
		  xhr.setRequestHeader ("Authorization", token);
	  },
	  headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	  },
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
//				  displayComments(rootParentId);
//				  $('#modal').modal('hide');
//				  refreshSliderIfNeeded("comments");
			  } else {
				  editSingleItem("notification", null, null, data);
			  }
		  } else {
			  editSingleItem("notification", null, null, "saving_error");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "saving_error");
      }
	});
}

function saveItemInList(parentId, newItemList, previousItemList) {
	if (newItemList) {
		var itemListToAddItem = itemLists[newItemList];
		itemListItems = $.parseJSON(itemListToAddItem.query);
		if (!itemListItems) {
			itemListItems =[];
		}
		itemListItems.push(parentId);
		itemListToAddItem.query = JSON.stringify(itemListItems);
		saveItemListItems(itemListToAddItem);
	}
	if (previousItemList) {
		var itemListToRemoveItem = itemLists[previousItemList];
		itemListItems = $.parseJSON(itemListToRemoveItem.query);
		if (itemListItems) {
			var index = itemListItems.indexOf(parentId);
			if (index > -1) {
				itemListItems.splice(index, 1);
				itemListToRemoveItem.query = JSON.stringify(itemListItems);
				saveItemListItems(itemListToRemoveItem);
			}
		}
	}
	refreshItemListDefault();
}

function refreshItemListDefault() {
	var itemListDefault = $(".content .item-list-select>option[value='']");
	if (itemLists && itemLists.length > 0) {
		if (itemListDefault.is(':selected')) {
			itemListDefault.text("dodaj u izbor");
		} else {		
			itemListDefault.text("izbaci iz izbora");
		}
	} else {
		itemListDefault.text("kreirajte novi izbor da biste mogli dodavati u njega");
	}
	
}