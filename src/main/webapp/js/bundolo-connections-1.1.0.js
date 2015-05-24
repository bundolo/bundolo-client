$(document).ready(function() {
	$('body').on('click', '.save_connection', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveConnection();
		}
	});
});

function saveConnection() {
	if (!isFormValid($(mainFormPath))) {
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
				  if (data == 'success') {
					  $('#edit_content').destroy();
					  var itemUrl = rootFolder+"connection"+"/" + name.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("connection", name);
					  } else {
						  $.address.value(itemUrl);
					  }
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