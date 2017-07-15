var postParentId;

$(document).ready(function() {
	$('body').on('click', '.save_post', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			savePost();
		}
	});
	$('body').on('click', '.save_topic', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			saveTopic();
		}
	});
});

function addPost(parentId) {
	$('.content>.item-footer').hide();
	postParentId = parentId;
	var parentElement = $('.posts-root');
	$.get(rootFolder+"templates/edit_post" + "-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {});
		parentElement.append(rendered);
		$('.default-focus').focus();
		if (username != 'gost') {
			$("#edit_credentials>option[value='logged']").html(username);
			$("#edit_credentials").val('logged');
		} else {
			$("#edit_credentials>option[value='logged']").remove();
            $(".save_post").addClass("disabled");
            var formHeading = parentElement.find(".expand-content>div>h4");
            formHeading.text("anonimne odgovore na forumu možete unositi samo ulogovani");
            formHeading.addClass("alert alert-danger");
		}
	});
}

function cancelPost() {
	$('.posts-root .expand-content').remove();
	handlingForm = false;
	$('.content>.item-footer').show();
}

function savePost() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var postContent = $('#edit_content').val();
	var post = {};
	post.contentId = $("#edit_item_id").val();
	post.text = sanitize(postContent);
	post.parentContent = {"contentId" : postParentId};
	var credentials = $('#edit_credentials').val() == 'logged' ? token : "Basic " + btoa(" : ");
	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/post",
	  type: "POST",
	  data: JSON.stringify(post),
	  dataType: "json",
	  contentType: "application/json; charset=utf-8",
	  beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", credentials);
	    },
	  headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
      complete: function (xhr, ajaxOptions, thrownError) {
    	  handlingForm = false;
    	  if (xhr.status == 200) {
    		  checkTextAdding();
    		  loadFromAddress();
    	  } else if (xhr.status == 400) {
    		  displayModal("notification", null, null, xhr.responseText);
    	  } else {
    		  displayModal("notification", null, null, "saving_error");
    	  }
      }
	});
}

function saveTopic() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var topic = {};
	topic.contentId = $("#edit_item_id").val();
	topic.name = $("#edit_title").val();
	topic.parentContent = {};
	topic.parentContent.contentId = $("#edit_group").val();
	$.ajax({
		  url: rootPath + restRoot + "/topic",
		  type: "POST",
		  data: JSON.stringify(topic),
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
	    		  checkTextAdding();
	    		  $.address.value(rootFolder+xhr.responseText);
	    	  } else if (xhr.status == 400) {
	    		  displayModal("notification", null, null, xhr.responseText);
	    	  } else {
	    		  displayModal("notification", null, null, "saving_error");
	    	  }
	      }
		});
}