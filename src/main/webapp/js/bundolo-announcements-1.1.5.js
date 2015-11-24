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
//		  success: function(data) {
//			  //console.log("success: status:" + status);
//			  console.log("success: data:" + data);
//			  if (data) {
//				  $('#edit_content').destroy();
//				  var itemUrl = rootFolder+"announcement"+"/" + name.replace(/ /g, '~');
//				  if (itemUrl == $.address.value()) {
//					  displaySingleItem("announcement", name);
//				  } else {
//					  $.address.value(itemUrl);
//				  }
//			  } else {
//				  displayModal("notification", null, null, "saving_error");
//			  }
//	      },
//	      error: function (xhr, ajaxOptions, thrownError) {
//	    	  console.log("error: status: " + xhr.status);
//	    	  console.log("error: responseText: " + xhr.responseText);
//	    	  displayModal("notification", null, null, "saving_error");
//	      },
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
				  $('#edit_content').destroy();
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  //TODO switch to slug
					  displaySingleItem("announcement", name);
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