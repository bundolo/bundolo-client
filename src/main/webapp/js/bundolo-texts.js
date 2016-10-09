$(document).ready(function() {
	$('body').on('click', '.save_text', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveText();
		}
	});
});

function saveText() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var text = {};
	text.contentId = $("#edit_item_id").val();
	text.description = [];
	var description = {};
	description.text = $("#edit_description").val();
	text.description.push(description);
	text.text = $("#edit_content").code();
	text.name = $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/text",
		  type: "POST",
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
	      complete: function (xhr, ajaxOptions, thrownError) {
	    	  handlingForm = false;
	    	  if (xhr.status == 200) {
	    		  $('#edit_content').destroy();
				  if (rootFolder+xhr.responseText == $.address.value()) {
					  loadFromAddress();
				  } else {
					  $.address.value(rootFolder+xhr.responseText);
					  checkTextAdding();
				  }
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
	      }
		});
}