$(document).ready(function() {
});

function addPost() {
	$('#modal').addClass("edit-post");
	$('#editor_label').html('Add post');
	$('#modal').modal('show');
}

function savePost(content) {
	//TODO validation
	displayPost(textTitle, textDescription, textContent);
	$('#modal').modal('hide');
}
function addTopic() {
	$('#modal').addClass("edit-topic");
	$('#editor_label').html('Add topic');
	$('#modal').modal('show');
}
function saveTopic(title, content) {
	//TODO validation
	displayTopic(title);
	$('#modal').modal('hide');
}