var episodeParentId;
var episodeParentName;
$(document).ready(function() {
});

function addEpisode(parentId, parentName) {
	episodeParentId = parentId;
	episodeParentName = parentName;
	editSingleItem('episode');
}

function saveEpisode(title, content) {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}	
	var episodeName = episodeParentName + "/" + $("#edit_title").val();
	var episode = {};
	episode.contentId = $("#edit_item_id").val();
	episode.text = $("#edit_content").code();
	episode.parentContent = {"contentId" : episodeParentId};

	console.log(JSON.stringify(episode));
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
				  console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  $('#edit_content').destroy();
				  $.address.value(rootFolder+"episode"+"/" + episodeName.replace(/ /g, '~'));
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

function saveSerial(title, description) {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var serialName = $("#edit_title").val();
	var serial = {};
	serial.contentId = $("#edit_item_id").val();
	serial.text = $("#edit_description").val();

	console.log(JSON.stringify(serial));
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
				  console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  $.address.value(rootFolder+"serial"+"/" + serialName.replace(/ /g, '~'));
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

//function displayEpisode(id) {
//	$.address.value(rootFolder+"episode"+"/" + id.replace(/ /g, '~'));
//}