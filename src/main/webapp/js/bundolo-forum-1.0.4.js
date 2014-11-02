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
	postParentId = parentId;
	editSingleItem('post');
}

function savePost() {
	if (!isFormValid($('#modal form'))) {
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
	  success: function(data) {
		  if (data) {
			  if (data == 'success') {
				  var reminder = $.address.value().substr(rootFolder.length);
				  var slashPos = reminder.indexOf('/');
				  if (slashPos > 0) {
					  displaySingleItem('topic', reminder.substr(slashPos + 1));
				  }
				  $('#modal').modal('hide');
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

function saveTopic() {
	if (!isFormValid($('#modal form'))) {
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
		  success: function(data) {
			  if (data) {
				  if (data == 'success') {
					  $('#modal').modal('hide');
					  $.address.value(rootFolder+"topic"+"/" + name.replace(/ /g, '~'));
					  refreshSliderIfNeeded("topics");
					  refreshSidebarIfNeeded("topics");
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