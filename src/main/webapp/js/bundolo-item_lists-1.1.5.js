$(document).ready(function() {
	$('body').on('click', '.save_item_list', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveItemList();
		}
	});
});

function saveItemList() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var itemList = {};
	itemList.itemListId = $("#edit_item_id").val();
	itemList.query = $("#edit_item_query").val();
	itemList.descriptionContent = {};
	itemList.descriptionContent.text = $("#edit_description").val();
	itemList.descriptionContent.name = $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/item_list",
		  type: "POST",
		  data: JSON.stringify(itemList),
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

function saveItemListItems(itemList) {
	$.ajax({
	  url: rootPath + restRoot + "/item_list",
	  type: "POST",
	  data: JSON.stringify(itemList),
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

    	  } else if (xhr.status == 400) {
    		  displayModal("notification", null, null, xhr.responseText);
    	  } else {
    		  displayModal("notification", null, null, "saving_error");
    	  }
      }
	});
}