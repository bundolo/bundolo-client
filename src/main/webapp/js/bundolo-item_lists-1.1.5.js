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
	var name = $("#edit_title").val();
	$.ajax({
		  url: rootPath + restRoot + "/item_list/" + name,
		  type: "PUT",
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
//		  success: function(data) {
//			  if (data) {
//				  if (data == 'success') {
//					  var itemUrl = rootFolder+"item_list"+"/" + name.replace(/ /g, '~');
//					  if (itemUrl == $.address.value()) {
//						  displaySingleItem("item_list", name);
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
					  displaySingleItem("item_list", name);
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
	  url: rootPath + restRoot + "/item_list/" + itemList.descriptionContent.name,
	  type: "PUT",
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
//	  success: function(data) {
//		  if (data) {
//			  if (data == 'success') {
//
//			  } else {
//				  displayModal("notification", null, null, data);
//			  }
//		  } else {
//			  displayModal("notification", null, null, "saving_error");
//		  }
//      },
//      error: function(data) {
//    	  displayModal("notification", null, null, "saving_error");
//      }
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