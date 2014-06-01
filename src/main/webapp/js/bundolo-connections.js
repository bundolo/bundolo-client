$(document).ready(function() {
});

function addConnection() {
	$('#modal').addClass("edit-connection");
	$('#editor_label').html('Add connection');
	$('#modal').modal('show');
}

function saveConnection(title, content) {
	//TODO validation
	displayConnection(title, content);
	$('#modal').modal('hide');
}