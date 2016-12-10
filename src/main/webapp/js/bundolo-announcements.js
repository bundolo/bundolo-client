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
	announcement.name = $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/announcement",
		  type: "POST",
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
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
				  $('#edit_content').destroy();
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  loadFromAddress();
				  } else {
					  checkTextAdding();
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