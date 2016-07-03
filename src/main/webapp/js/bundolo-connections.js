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
	connection.descriptionContent.name = $("#edit_title").val();
	connection.parentContent = {};
	connection.parentContent.contentId = $("#edit_group").val();
	connection.url = $("#edit_url").val();
	connection.email = $("#edit_email").val();
	$.ajax({
		  url: rootPath + restRoot + "/connection",
		  type: "POST",
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
		  complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
				  $('#edit_content').destroy();
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  loadFromAddress();
				  } else {
					  $.address.value(rootFolder+xhr.responseText);
				  }
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
	      }
		});
}