var episodeParentId;
var episodeParentName;

function addEpisode(parentId, parentName) {
	episodeParentId = parentId;
	episodeParentName = parentName;
	editSingleItem('episode');
}

function saveEpisode(title, content) {
	if (!isFormValid($('#modal form'))) {
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
		  success: function(data) {  
			  if (data) {
				  if (data == 'success') {
					  $('#modal').modal('hide');
					  $('#edit_content').destroy();
					  var itemUrl = rootFolder+"episode"+"/" + episodeName.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("episode", episodeName);
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

function saveSerial(title, description) {
	if (!isFormValid($('#modal form'))) {
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
		  success: function(data) {  
			  if (data) {
				  if (data == 'success') {
					  $('#modal').modal('hide');
					  var itemUrl = rootFolder+"serial"+"/" + serialName.replace(/ /g, '~');
					  if (itemUrl == $.address.value()) {
						  displaySingleItem("serial", serialName);
					  } else {
						  $.address.value(itemUrl);
					  }
					  refreshSliderIfNeeded("serials");
					  refreshSidebarIfNeeded("serials");
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