var postParentId;
$(document).ready(function() {
});

function addPost(parentId) {
	postParentId = parentId;
	editSingleItem('post');
}

function savePost(content) {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var postContent = $('#edit_content').val();
	var post = {};
	post.contentId = $("#edit_item_id").val();
	post.text = sanitize(postContent);
	post.parentContent = {"contentId" : postParentId};
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/post",
	  type: "POST",
	  data: JSON.stringify(post),
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
			  var reminder = $.address.value().substr(rootFolder.length);
			  var slashPos = reminder.indexOf('/');
			  console.log("reminder: " + reminder);
			  if (slashPos > 0) {
				  displaySingleItem('topic', reminder.substr(slashPos + 1));
			  }
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

function saveTopic() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var topic = {};
	topic.contentId = $("#edit_item_id").val();
	var name = $("#edit_title").val();
	topic.parentContent = {};
	topic.parentContent.contentId = $("#edit_group").val();

	console.log(JSON.stringify(topic));
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
				  console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  $.address.value(rootFolder+"topic"+"/" + name.replace(/ /g, '~'));
				  refreshSliderIfNeeded("topics");
				  refreshSidebarIfNeeded("topics");
			  } else {
				  editSingleItem("notification", null, null, "snimanje nije uspelo!");
			  }
	      },
	      error: function(data) {
	    	  editSingleItem("notification", null, null, "snimanje nije uspelo!");
	      },
	      complete: function(data) {
//	    	  console.log("complete: " + JSON.stringify(data));
	      }
		});
}