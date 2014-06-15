var commentParentElement;
var commentParentId;
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
	
	/*
	 * instead of hover for context and comment buttons add these handlers to se overflow and add hover class. make it generic
	$('body').on('mouseenter', '[title]', function(e) {
		displayStatusBar($(this).attr('title'));
	});
	$('body').on('mouseleave', '.navbar-header [title]', function(e) {
		displayStatusBar('');
	});
	*/
});

function setContextMenuPostion(event, contextMenu) {
    var mousePosition = {};
    var menuPostion = {};
    var menuDimension = {};

    menuDimension.x = contextMenu.outerWidth();
    menuDimension.y = contextMenu.outerHeight();
    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;

    if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
        menuPostion.x = mousePosition.x - menuDimension.x;
    } else {
        menuPostion.x = mousePosition.x;
    }

    if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
        menuPostion.y = mousePosition.y - menuDimension.y;
    } else {
        menuPostion.y = mousePosition.y;
    }

    contextMenu.css({
        display: "block",
        left: menuPostion.x,
        top: menuPostion.y
    });
    return menuPostion;
}

function addContextMenu(parentElement, parentId) {
	var commentsButton = $('<span class="fa-stack fa-2x comments-button" id="comments_' + parentId + '">\
			<i class="fa fa-circle fa-stack-2x"></i>\
			<i class="fa fa-comment-o fa-stack-1x fa-inverse"></i>\
			</span>');
	commentsButton.hover(
		function() {
			$(this).parent().addClass("hover");
			if ($(this).parent().parent().css("overflow")=="hidden") {
				$(this).parent().parent().addClass("show-overflow");
			}
		}, function() {
			$(this).parent().removeClass("hover");
			$(this).parent().parent().removeClass("show-overflow");
		}
	);
	commentsButton.click(function(e) {
		var contextRootElement = $('.context-menu>div>div');
		contextRootElement.html(spinner);
		$.get(rootFolder+"templates/comments.html", function(template) {
			$.getJSON(rootPath + restRoot + "/comments/" + parentId, function(data) {
				sanitizeRecursive(data);
				var partials = {commentPanel: template};
			    var rendered = Mustache.render(template, {"comments": data}, partials);
			    var rootCommentButton = $('<span title="Add comment" class="fa-stack fa-2x pull-right root-comment-button" id="comment_'+parentId+'">\
						<i class="fa fa-circle fa-stack-2x"></i>\
						<i class="fa fa-plus fa-stack-1x fa-inverse"></i>\
					</span>');
			    contextRootElement.html(rootCommentButton);
			    contextRootElement.append(rendered);
			});
		});
		setContextMenuPostion(e, $('.context-menu'));
        return false;
    });
	commentsButton.attr("title", "Comments");
	parentElement.append(commentsButton);
}

function sanitizeRecursive(data) {
	if($.isArray(data) && data.length) {
		for (index in data) {
		  data[index].text = sanitize(data[index].text);
		  if(!$.isArray(data[index].comments)) {
			  data[index].comments = [];
		  }
		  sanitizeRecursive(data[index].comments);
		}
	}
}

function addComment(parentElement, parentId) {
	$('#modal').addClass("edit-comment");
	$('#edit_content').code('');
	$('#editor_label').html('Add comment');
	commentParentElement = parentElement;
	commentParentId = parentId;
	$('#modal').modal('show');
}

function saveComment(commentContent) {
	//TODO validation
	//TODO actual saving
	var comment = {};
	comment.authorUsername = "a";
	comment.text = sanitize(commentContent);
	comment.parentContent = {"contentId" : commentParentId};
//	var JSONObject= '{"authorUsername":"a","kind":"text_comment","text":sanitize(commentContent),"locale":"sr","contentStatus":"active", "parentContent":{"contentId":"287124"}}';
//	var JSONObject= {"authorUsername":"a","kind":"text_comment","text":sanitize(commentContent),"locale":"sr","contentStatus":"active", "parentContent":{"contentId":"287124"}};
	//var JSONObject= '{"authorUsername":"kilopond"}';
	//var JSONObject= {"authorUsername":"kilopond","kind":"text_comment","text":"gaaa","locale":"sr","contentStatus":"active"};
	//var jsonData = JSON.parse(JSONObject);    

	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/comment",
	  type: "POST",
	  data: JSON.stringify(comment),
//	  data: comment,
	  dataType: "json",
	  headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
	  success: function(data) {  
		  displayComment('a', sanitize(commentContent), commentParentElement);
		  $('#modal').modal('hide');
      }  
	});
	
}

function displayComment(author, content, parentElement) {
	$.get('/templates/comment.html', function(template) {
		var rendered = Mustache.render(template, {"author": author, "content": content});
	    parentElement.append($(rendered));
	});
}