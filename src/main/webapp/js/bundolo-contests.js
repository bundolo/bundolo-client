function saveContest() {
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var contest = {};
	contest.contestId = $("#edit_item_id").val();
	contest.descriptionContent = {};
	contest.descriptionContent.text = $("#edit_content").code();
	contest.descriptionContent.name = $("#edit_title").val();
	contest.expirationDate = $("#edit_expiration_date").val();
	$.ajax({
		  url: rootPath + restRoot + "/contest/" + contest.descriptionContent.name,
		  type: "PUT",
		  data: JSON.stringify(contest),
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
					  var itemUrl = rootFolder+"contest"+"/" + contest.descriptionContent.name.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("contest", contest.descriptionContent.name);
					  } else {
						  $.address.value(itemUrl);
					  }
					  refreshSliderIfNeeded("contests");
					  refreshSidebarIfNeeded("contests");
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