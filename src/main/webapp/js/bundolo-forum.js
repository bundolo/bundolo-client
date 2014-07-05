$(document).ready(function() {
});

function addPost() {
	$('#modal').addClass("edit-post");
	$('#editor_label').html('Add post');
	$('#modal').modal('show');
}

function savePost(content) {
	//TODO validation
	displayPost(textTitle, textDescription, textContent);
	$('#modal').modal('hide');
}

function saveTopic() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var topic = {};
	topic.name = $("#edit_title").val();
	topic.parentContent = {};
	topic.parentContent.contentId = $("#edit_group").val();

	console.log(JSON.stringify(topic));
	$.ajax({
		  url: rootPath + restRoot + "/topic/" + topic.name,
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
				  displaySingleItem('topic', topic.name.replace(/ /g, '~'));
			  } else {
				  alert("saving failed");
			  }
	      },
	      error: function(data) {
	    	  alert("saving failed");
	      },
	      complete: function(data) {
//	    	  console.log("complete: " + JSON.stringify(data));
	      }
		});
}