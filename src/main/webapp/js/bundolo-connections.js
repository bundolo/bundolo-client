$(document).ready(function() {
});

function saveConnection(title, content) {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var connection = {};
	connection.descriptionContent = {};
	connection.descriptionContent.text = $("#edit_description").code();
	connection.descriptionContent.name = $("#edit_title").val();
	connection.parentContentId = $("#edit_group").val();
	connection.url = $("#edit_url").val();
	connection.email = $("#edit_email").val();

	console.log(JSON.stringify(connection));
	$.ajax({
		  url: rootPath + restRoot + "/connection/" + connection.descriptionContent.name,
		  type: "PUT",
		  data: JSON.stringify(connection),
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
				  $('#edit_description').destroy();
				  displaySingleItem('connection', connection.descriptionContent.name.replace(/ /g, '~'));
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