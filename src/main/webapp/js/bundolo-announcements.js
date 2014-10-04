$(document).ready(function() {
});

function saveAnnouncement() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var announcement = {};
	announcement.contentId = $("#edit_item_id").val();
	announcement.text = $("#edit_content").code();
	var name = $("#edit_title").val();

	console.log(JSON.stringify(announcement));
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
				  //console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  $('#edit_content').destroy();
				  var itemUrl = rootFolder+"announcement"+"/" + name.replace(/ /g, '~');
				  if (itemUrl == $.address.value()) {
					  displaySingleItem("announcement", name);
				  } else {
					  $.address.value(itemUrl);
				  }
				  refreshSliderIfNeeded("announcements");
				  refreshSidebarIfNeeded("announcements");
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