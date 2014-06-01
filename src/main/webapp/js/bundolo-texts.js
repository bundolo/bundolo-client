$(document).ready(function() {
});

function addText() {
	$('#modal').addClass("edit-text");
	$('#editor_label').html('Add text');
	$('#modal').modal('show');
}

function saveText(title, description, content) {
	//TODO validation
	displayText({'author' : 'dummy_user', 'title' : title, 'description' : description, 'content' : content});
	$('#modal').modal('hide');
}