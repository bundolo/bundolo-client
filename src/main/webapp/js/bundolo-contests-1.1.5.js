$(document).ready(function() {
	$('body').on('click', '.save_contest', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveContest();
		}
	});
});

function saveContest() {
	if (!isFormValid($(mainFormPath))) {
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
//		  success: function(data) {
//			  if (data) {
//				  if (data == 'success') {
//					  $('#edit_content').destroy();
//					  var itemUrl = rootFolder+"contest"+"/" + contest.descriptionContent.name.replace(/ /g, '~');
//					  if (itemUrl == $.address.value()) {
//						  displaySingleItem("contest", contest.descriptionContent.name);
//					  } else {
//						  $.address.value(itemUrl);
//					  }
//				  } else {
//					  displayModal("notification", null, null, data);
//				  }
//			  } else {
//				  displayModal("notification", null, null, "saving_error");
//			  }
//	      },
//	      error: function(data) {
//	    	  displayModal("notification", null, null, "saving_error");
//	      }
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
				  $('#edit_content').destroy();
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  //TODO switch to slug
					  displaySingleItem("contest", contest.descriptionContent.name);
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