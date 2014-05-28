var commentParentElement;
$(document).ready(function() {
	$('body').on('click', function(e) {
		var modalDialog = $('#modal');
		var contextMenu = $('.context-menu');
		var targetParents = $(e.target).parents();
		if ((targetParents.index(modalDialog) == -1) && !modalDialog.hasClass('in') && (targetParents.index(contextMenu) == -1)) {
            if(contextMenu.is(":visible")) {
            	contextMenu.hide()
            }
        }
	});
	
	$('body').on('click', '.root-comment-button', function(e) {
		addComment($('.context-menu>div>div'));
	});
	$('body').on('click', '.comment-button', function(e) {
		addComment($(e.target).closest('.comment').find('>.panel-collapse>.panel-body>.panel-group>div>div'));
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

function addContextMenu(parentElement) {
	var commentsButton = $('<span class="fa-stack fa-2x comments-button">\
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
		//TODO display all existing comments
		setContextMenuPostion(e, $('.context-menu'));
        return false;
    });
	commentsButton.attr("title", "Comments");
	parentElement.append(commentsButton);
}

function addComment(parentElement) {
	$('#modal').addClass("edit-comment");
	$('#edit_content').code('');
	$('#editor_label').html('Add comment');
	commentParentElement = parentElement;
	$('#modal').modal('show');
}

function saveComment(commentContent) {
	//TODO validation
	//TODO actual saving
	displayComment('dummy_user', sanitize(commentContent), commentParentElement);
	$('#modal').modal('hide');
}

function displayComment(author, content, parentElement) {
	$.get('templates/comment.html', function(template) {
		var rendered = Mustache.render(template, {"author": author, "content": content});
	    parentElement.append($(rendered));
	});
}