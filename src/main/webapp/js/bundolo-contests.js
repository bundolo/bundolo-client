$(document).ready(function() {
});

function addContest() {
	$('#modal').addClass("edit-contest");
	$('#editor_label').html('Add contest');
	$('#modal').modal('show');
}

function saveContest() {
	//TODO validation
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var contest = {};
	contest.descriptionContent = {};
	contest.descriptionContent.text = $("#edit_content").code();
	contest.descriptionContent.name = $("#edit_title").val();
	contest.expirationDate = $("#edit_expiration_date").val();

	console.log(JSON.stringify(contest));
	$.ajax({
		  url: rootPath + restRoot + "/contest/" + contest.descriptionContent.name,
		  type: "PUT",
		  data: JSON.stringify(contest),
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
				  displaySingleItem('contest', contest.descriptionContent.name.replace(/ /g, '~'));
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

function saveComment() {	
	//TODO validation
	var commentContent = $('#edit_content').val();
	var comment = {};
	//comment.authorUsername = "a";
	comment.text = sanitize(commentContent);
	comment.parentContent = {"contentId" : commentParentId};
//	var JSONObject= '{"authorUsername":"a","kind":"text_comment","text":sanitize(commentContent),"locale":"sr","contentStatus":"active", "parentContent":{"contentId":"287124"}}';
//	var JSONObject= {"authorUsername":"a","kind":"text_comment","text":sanitize(commentContent),"locale":"sr","contentStatus":"active", "parentContent":{"contentId":"287124"}};
	//var JSONObject= '{"authorUsername":"kilopond"}';
	//var JSONObject= {"authorUsername":"kilopond","kind":"text_comment","text":"gaaa","locale":"sr","contentStatus":"active"};
	//var jsonData = JSON.parse(JSONObject);    

	//TODO display spinner
	$.ajax({
	  url: rootPath + restRoot + "/comment",
	  type: "POST",
	  data: JSON.stringify(comment),
//	  data: comment,
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
		  displayComment(username, sanitize(commentContent), commentParentElement);
		  $('#modal').modal('hide');
      }
	});
}