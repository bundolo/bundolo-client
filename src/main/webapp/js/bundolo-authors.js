$(document).ready(function() {
});

function addAuthor() {
	$('#modal').addClass("edit-author");
	$('#modal').modal('show');
}

function saveAuthor(author, description) {
	//TODO validation
	displayAuthor('dummy_user', date, description);
	$('#modal').modal('hide');
}