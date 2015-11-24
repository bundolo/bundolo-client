var postParentId;

$(document).ready(function() {
	$('body').on('click', '.save_post', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			savePost();
		}
	});
	$('body').on('click', '.save_topic', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveTopic();
		}
	});
});

function addPost(parentId) {
	$('.content>.item-footer').hide();
	postParentId = parentId;
	var parentElement = $('.posts-root');
	$.get(rootFolder+"templates/edit_post" + "-" + version + ".html", function(template) {
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

function cancelPost() {
	$('.posts-root .expand-content').remove();
	handlingForm = false;
	$('.content>.item-footer').show();
}

function savePost() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var postContent = $('#edit_content').val();
	var post = {};
	post.contentId = $("#edit_item_id").val();
	post.text = sanitize(postContent);
	post.parentContent = {"contentId" : postParentId};
	var credentials = $('#edit_credentials').val() == 'logged' ? token : "Basic " + btoa(" : ");
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/post",
	  type: "POST",
	  data: JSON.stringify(post),
	  dataType: "json",
	  contentType: "application/json; charset=utf-8",
	  beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", credentials);
	    },
	  headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
//	  success: function(data) {
//		  if (data) {
//			  if (data == 'success') {
//				  var reminder = $.address.value().substr(rootFolder.length);
//				  var slashPos = reminder.indexOf('/');
//				  if (slashPos > 0) {
//					  displaySingleItem('topic', reminder.substr(slashPos + 1));
//				  }
//			  } else {
//				  displayModal("notification", null, null, data);
//			  }
//		  } else {
//			  displayModal("notification", null, null, "saving_error");
//		  }
//      },
//      error: function(data) {
//    	  displayModal("notification", null, null, "saving_error");
//      }
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

function saveTopic() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var topic = {};
	topic.contentId = $("#edit_item_id").val();
	var name = $("#edit_title").val();
	topic.parentContent = {};
	topic.parentContent.contentId = $("#edit_group").val();
	$.ajax({
		  url: rootPath + restRoot + "/topic/" + name,
		  type: "PUT",
		  data: JSON.stringify(topic),
		  dataType: "json",
		  contentType: "application/json; charset=utf-8",
		  beforeSend: function (xhr) {
			  xhr.setRequestHeader ("Authorization", token);
		  },
		  headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json'
		  },
//		  success: function(data) {
//			  if (data) {
//				  if (data == 'success') {
//					  $.address.value(rootFolder+"topic"+"/" + name.replace(/ /g, '~'));
//				  } else {
//					  displayModal("notification", null, null, data);
//				  }
//			  } else {
//				  displayModal("notification", null, null, "saving_error");
//			  }
//	      },
//	      error: function(data) {
//	    	  displayModal("notification", null, null, "saving_error");
//	      }
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
	    		  $.address.value(rootFolder+xhr.responseText);
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
	      }
		});
}