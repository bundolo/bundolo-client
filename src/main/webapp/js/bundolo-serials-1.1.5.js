var episodeParentId;
var episodeParentName;

$(document).ready(function() {
	$('body').on('click', '.save_episode', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveEpisode();
		}
	});

	$('body').on('click', '.save_serial', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveSerial();
		}
	});
});

function addEpisode(parentId, parentName) {
	episodeParentId = parentId;
	episodeParentName = parentName;
	editSingleItem('episode');
}

function saveEpisode(title, content) {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var episodeName = episodeParentName + "/" + $("#edit_title").val();
	var episode = {};
	episode.contentId = $("#edit_item_id").val();
	episode.text = $("#edit_content").code();
	episode.parentContent = {"contentId" : episodeParentId};
	episode.contentStatus = $("#edit_finalized").prop('checked')?"active":"pending";
	$.ajax({
		  url: rootPath + restRoot + "/episode/" + episodeName,
		  type: "PUT",
		  data: JSON.stringify(episode),
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
//					  var itemUrl = rootFolder+"episode"+"/" + episodeName.replace(/ /g, '~');
//					  if (itemUrl == $.address.value()) {
//						  displaySingleItem("episode", episodeName);
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
					  displaySingleItem("episode", episodeName);
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

function saveSerial(title, description) {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var serialName = $("#edit_title").val();
	var serial = {};
	serial.contentId = $("#edit_item_id").val();
	serial.text = $("#edit_description").val();
	$.ajax({
		  url: rootPath + restRoot + "/serial/" + serialName,
		  type: "PUT",
		  data: JSON.stringify(serial),
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
//					  var itemUrl = rootFolder+"serial"+"/" + serialName.replace(/ /g, '~');
//					  if (itemUrl == $.address.value()) {
//						  displaySingleItem("serial", serialName);
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
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  //TODO switch to slug
					  displaySingleItem("serial", serialName);
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