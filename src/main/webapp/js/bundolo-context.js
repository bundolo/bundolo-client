var commentParentElement;
var commentParentId;
var rootParentId;
$(document).ready(function() {
	$('body').on('click', function(e) {
		var modalDialog = $('#modal');
		var contextMenu = $('.context-menu');
		var targetParents = $(e.target).parents();
		if ((targetParents.index(modalDialog) == -1) && !modalDialog.hasClass('in') && (targetParents.index(contextMenu) == -1)) {
            if(contextMenu.is(":visible")) {
            	contextMenu.hide();
            }
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
	
	$('body').on('mouseenter', '.comments-button, .root-comment-button, .comment-button', function(e) {
		$(this).parent().addClass("hover");
		if ($(this).parent().parent().css("overflow")=="hidden") {
			$(this).parent().parent().addClass("show-overflow");
		}
	});
	$('body').on('mouseleave', '.comments-button, .root-comment-button, .comment-button', function(e) {
		$(this).parent().removeClass("hover");
		$(this).parent().parent().removeClass("show-overflow");
	});
	$(window).resize(resizer);
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

function addContextMenu(parentElement, parentId) {
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
	$.get(rootFolder+"templates/comments.html", function(template) {
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
		  data[index].text = sanitize(data[index].text);
		  if(!$.isArray(data[index].comments)) {
			  data[index].comments = [];
		  }
//		  if (!data[index].authorUsername) {
//			  data[index].authorUsername = 'gost';
//		  }
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
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/comment",
	  type: "POST",
	  data: JSON.stringify(comment),
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
			  displayComments(rootParentId);
			  $('#modal').modal('hide');
		  } else {
			  editSingleItem("notification", null, null, "snimanje nije uspelo!");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "snimanje nije uspelo!");
      }
	});
}