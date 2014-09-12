$(document).ready(function() {
});

function saveText() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var text = {};
	text.contentId = $("#edit_item_id").val();
	text.description = [];
	var description = {};
	description.text = $("#edit_description").val();
	text.description.push(description);
	text.text = $("#edit_content").code();
	var name = username + "/" + $("#edit_title").val();

	//console.log(JSON.stringify(text));
	$.ajax({
		  url: rootPath + restRoot + "/text/" + name,
		  type: "PUT",
		  data: JSON.stringify(text),
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
				  $.address.value(rootFolder+"text"+"/" + name.replace(/ /g, '~'));
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