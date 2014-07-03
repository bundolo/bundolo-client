$(document).ready(function() {
});

function saveAnnouncement() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var announcement = {};
	announcement.text = $("#edit_content").code();
	announcement.name = $("#edit_title").val();

	console.log(JSON.stringify(announcement));
	$.ajax({
		  url: rootPath + restRoot + "/announcement/" + announcement.name,
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
				  console.log("success: " + JSON.stringify(data));
				  $('#modal').modal('hide');
				  $('#edit_content').destroy();
				  displaySingleItem('announcement', announcement.name.replace(/ /g, '~'));
			  } else {
				  alert("saving failed");
			  }
	      },
	      error: function(data) {
	    	  alert("saving failed");
	      },
	      complete: function(data) {
//	    	  console.log("complete: " + JSON.stringify(data));
	      }
		});
}