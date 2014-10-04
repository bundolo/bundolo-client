$(document).ready(function() {
});

function saveConnection() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var connection = {};
	connection.connectionId = $("#edit_item_id").val();
	connection.descriptionContent = {};
	connection.descriptionContent.text = $("#edit_content").code();
	var name = $("#edit_title").val();
	connection.parentContent = {};
	connection.parentContent.contentId = $("#edit_group").val();
	connection.url = $("#edit_url").val();
	connection.email = $("#edit_email").val();

	console.log(JSON.stringify(connection));
	$.ajax({
		  url: rootPath + restRoot + "/connection/" + name,
		  type: "PUT",
		  data: JSON.stringify(connection),
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
				  $('#edit_content').destroy();
				  var itemUrl = rootFolder+"connection"+"/" + name.replace(/ /g, '~');
				  if (itemUrl == $.address.value()) {
					  displaySingleItem("connection", name);
				  } else {
					  $.address.value(itemUrl);
				  }
				  refreshSliderIfNeeded("connections");
				  refreshSidebarIfNeeded("connections");
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