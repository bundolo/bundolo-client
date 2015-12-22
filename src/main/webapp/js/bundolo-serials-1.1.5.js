var episodeParentId;

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

function addEpisode(parentId) {
	episodeParentId = parentId;
	editSingleItem('episode');
}

function saveEpisode(title, content) {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var episode = {};
	episode.name = $("#edit_title").val();
	episode.contentId = $("#edit_item_id").val();
	episode.text = $("#edit_content").code();
	episode.parentContent = {"contentId" : episodeParentId};
	episode.contentStatus = $("#edit_active").prop('checked')?"active":"pending";
	$.ajax({
		  url: rootPath + restRoot + "/episode",
		  type: "POST",
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

function saveSerial(title, description) {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var serial = {};
	serial.name =  $("#edit_title").val();
	serial.contentId = $("#edit_item_id").val();
	serial.text = $("#edit_description").val();
	serial.contentStatus = $("#edit_pending").prop('checked')?"pending":"active";
	$.ajax({
		  url: rootPath + restRoot + "/serial",
		  type: "POST",
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
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
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