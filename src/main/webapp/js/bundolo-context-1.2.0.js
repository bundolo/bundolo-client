var commentParentId;
var rootParentId;
var rootType;
var itemLists;
var oldCommentLimit = 1000 * 60 * 60 * 24 * 30; /*30 days*/
$(document).ready(function() {
	$('body').on('click', '.save_comment', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveComment();
		}
	});
	$('body').on('click', '.root-comment-button', function(e) {
		var parentId = $('.root-comment-button').attr('id').substr(8);
		var parentElement = $('.comments-root');
		addComment(parentId, parentElement);
	});
	$('body').on('click', '.comment-button', function(e) {
		var parentElement = $(e.target).closest('.comment');
		var parentId = parentElement.find(">span").attr('id').substr(8);
		addComment(parentId, parentElement);
	});
	$('body').on('mouseenter', '.root-comment-button', function(e) {
		var commentsRoot = $('.comments-root');
		commentsRoot.addClass("hover");
		if (commentsRoot.parent().css("overflow")=="hidden") {
			commentsRoot.parent().addClass("show-overflow");
		}
	});
	$('body').on('mouseleave', '.root-comment-button', function(e) {
		var commentsRoot = $('.comments-root');
		commentsRoot.removeClass("hover");
		commentsRoot.parent().removeClass("show-overflow");
	});
	$('body').on('mouseenter', '.comment-button, .collapse_children', function(e) {
		$(this).parent().addClass("hover");
		if ($(this).parent().parent().css("overflow")=="hidden") {
			$(this).parent().parent().addClass("show-overflow");
		}
	});
	$('body').on('mouseleave', '.comment-button, .collapse_children', function(e) {
		$(this).parent().removeClass("hover");
		$(this).parent().parent().removeClass("show-overflow");
	});
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

	$("body").on("hide.bs.collapse", '.panel-collapse', function(e){
		$(e.target).parent().find(">.collapse_children>span").text("prikaži odgovore");
		$(e.target).parent().find(">.collapse_children>i").removeClass("fa-caret-up");
		$(e.target).parent().find(">.collapse_children>i").addClass("fa-caret-down");
	});
	$("body").on("show.bs.collapse", '.panel-collapse', function(e){
		$(e.target).parent().find(">.collapse_children>span").text("sakrij odgovore");
		$(e.target).parent().find(">.collapse_children>i").removeClass("fa-caret-down");
		$(e.target).parent().find(">.collapse_children>i").addClass("fa-caret-up");
	});

	$('body').on('click', '.collapse_old', function(e) {
		var collapseOldIcon = $('.collapse_old>i');
		collapseOldIcon.toggleClass("fa-caret-up fa-caret-down");
		if (collapseOldIcon.hasClass("fa-caret-up")) {
			$('.collapse_old>span').text("sakrij stare komentare");
			$('.comment.old').css("display","inline-block");
		} else {
			$('.collapse_old>span').text("prikaži stare komentare");
			$('.comment.old').css("display","none");
		}
	});
});

function addContextMenu(parentElement, parentId, parentType) {
	var contextContainerHtml = '<div class="row">\
		<div class="col-xs-12 context-root">\
		<a href="https://www.facebook.com/sharer/sharer.php?u='+rootPath+$.address.value()+'" target="_blank" class="share-facebook" title="podeli na facebooku"><i class="fa fa-facebook-official"></i></a>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-xs-12 comments-root">\
		</div>\
		</div>';
	var contextContainer = $(contextContainerHtml);
	parentElement.find('.content').append(contextContainer);
	if (username != 'gost') {
		$.getJSON(rootPath + restRoot + "/item_lists", { "start": 0, "end": -1, "orderBy": "date,desc", "filterBy": "author,"+username}, function( data ) {
			if (data) {
				itemLists = data;
				if (itemLists && itemLists.length > 0) {
					var itemListDropdownHtml = '<select class="item-list-select" title="izbor" id="item_lists_' + parentId + '">';
					itemListDropdownHtml += '<option value="">dodaj u izbor</option>';
					var itemListItems = null;
					var itemInList;
					for (index in data) {
						if (data[index].query) {
							itemListItems = $.parseJSON(data[index].query);
						}
						itemInList = itemListItems && itemListItems.indexOf(parentId) >= 0;
						itemListDropdownHtml += '<option value="'+index+'"'+(itemInList?' selected="selected"':'')+'>'+data[index].descriptionContent.name+'</option>';
					}
					itemListDropdownHtml += '</select>';
					var itemListDropdown = $(itemListDropdownHtml);
					parentElement.find('.context-root').append(itemListDropdown);
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
		    		parentElement.find('.context-root').append(ratingDropdown);
		    	}
			},
			error: function(textStatus, errorThrown) {
				//TODO
			}
		});
	}
	rootParentId = parentId;
	if (parentType != 'topic') {
    	//topic comments are disabled to avoid confusion with posts
    	//consider enabling comments on forum, or forum groups
		displayComments(parentId);
	}
}

function displayComments(parentId) {
	var commentsRootElement = $('.comments-root');
	commentsRootElement.html(spinner);
	$.get(rootFolder+"templates/comments" + "-" + version + ".html", function(template) {
		$.getJSON(rootPath + restRoot + "/parent_comments/" + parentId, function(data) {
			var hasOldComments = sanitizeRecursive(data, true);
			var partials = {commentPanel: template};
		    var rendered = Mustache.render(template, {"comments": data}, partials);
		    var rootCommentButtonString = '<h4>komentari';
		    if (hasOldComments) {
		    	rootCommentButtonString += '<span class="collapse_old" title="prikaži stare komentare"><i class="fa fa-caret-down"></i><span class="hidden-xs">prikaži stare komentare</span></span>';
		    }
		    rootCommentButtonString += '<span title="dodaj komentar" class="pull-right root-comment-button" id="comment_'+parentId+'">\
			<i class="fa fa-plus"></i><span class="hidden-xs">dodaj komentar</span>\
			</span></h4>';
		    var rootCommentButton = $(rootCommentButtonString);
		    commentsRootElement.html(rootCommentButton);
		    commentsRootElement.append(rendered);
		});
	});
}

function sanitizeRecursive(data, shouldCollapse) {
	var hasOldComments = false;
	if($.isArray(data) && data.length) {
		for (index in data) {
		  data[index].text = sanitizeRuntime(data[index].text);
		  if(data[index].authorUsername) {
			  data[index].authorText = '<a href="/author/' + slugifyText(data[index].authorUsername) + '" onclick="$.address.value(\'/author/' + slugifyText(data[index].authorUsername) + '\');return false;">' + data[index].authorUsername + '</a>';
		  } else {
			  data[index].authorText = 'gost';
		  }
		  data[index].avatarUrl = getAvatarUrl(data[index].avatarUrl, 40);
		  data[index].collapse = shouldCollapse;
		  data[index].old = $.now() - data[index].creationDate > oldCommentLimit;
		  hasOldComments = data[index].old || hasOldComments;

		  if(!$.isArray(data[index].comments)) {
			  data[index].comments = [];
		  }
//		  if($.isArray(data[index].comments) && data[index].comments.length) {
//			  data[index].hasChildren = true;
//		  } else {
//			  data[index].hasChildren = true;
//		  }
		  hasOldComments = sanitizeRecursive(data[index].comments, false) || hasOldComments;
		}
	}
	return hasOldComments;
}

function addComment(parentId, parentElement) {
	cancelComment();
	commentParentId = parentId;
	$.get(rootFolder+"templates/edit_comment" + "-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {});
		parentElement.append(rendered);
		$('.default-focus').focus();
		if (username != 'gost') {
			$("#edit_credentials>option[value='logged']").html(username);
			$("#edit_credentials").val('logged');
		} else {
			$("#edit_credentials>option[value='logged']").remove();
		}
	});
}

function cancelComment() {
	$('.comments-root .expand-content').remove();
	handlingForm = false;
}

function saveComment() {
	if (!isFormValid($(mainFormPath))) {
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
				  loadFromAddress();
//				  displayComments(rootParentId);
//				  if (rootType = 'serial') {
//					  var reminder = $.address.value().substr(rootFolder.length);
//					  var slashPos = reminder.indexOf('/');
//					  if (slashPos > 0) {
//						  displaySingleItem(reminder.substr(0, slashPos), reminder.substr(slashPos + 1));
//					  }
//				  }
			  } else {
				  displayModal("notification", null, null, data);
			  }
		  } else {
			  displayModal("notification", null, null, "saving_error");
		  }
      },
      error: function(data) {
    	  displayModal("notification", null, null, "saving_error");
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
			  } else {
				  displayModal("notification", null, null, data);
			  }
		  } else {
			  displayModal("notification", null, null, "saving_error");
		  }
      },
      error: function(data) {
    	  displayModal("notification", null, null, "saving_error");
      }
	});
}

function saveItemInList(parentId, newItemList, previousItemList) {
	if (newItemList) {
		var itemListToAddItem = itemLists[newItemList];
		var itemListItems = null;
		if (itemListToAddItem.query) {
			itemListItems = $.parseJSON(itemListToAddItem.query);
		}
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