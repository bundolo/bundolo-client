$(document).ready(function() {
	$('body').on('click', '.save_announcement', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveAnnouncement();
		}
	});
});

function saveAnnouncement() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var announcement = {};
	announcement.contentId = $("#edit_item_id").val();
	announcement.text = $("#edit_content").code();
	var name = $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/announcement/" + name,
		  type: "PUT",
		  data: JSON.stringify(announcement),
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
					  var itemUrl = rootFolder+"announcement"+"/" + name.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("announcement", name);
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