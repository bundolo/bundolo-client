function saveText() {
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var text = {};
	text.contentId = $("#edit_item_id").val();
	text.description = [];
	var description = {};
	description.text = $("#edit_description").val();
	text.description.push(description);
	text.text = $("#edit_content").code();
	var name = username + "/" + $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/text/" + name,
		  type: "PUT",
		  data: JSON.stringify(text),
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
					  $('#edit_content').destroy();
					  var itemUrl = rootFolder+"text"+"/" + name.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("text", name);
					  } else {
						  $.address.value(itemUrl);
					  }
					  refreshSliderIfNeeded("texts");
					  refreshSidebarIfNeeded("texts");
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