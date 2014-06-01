$(document).ready(function() {
});

function addAnnouncement() {
	$('#modal').addClass("edit-announcement");
	$('#editor_label').html('Add announcement');
	$('#modal').modal('show');
}

function saveAnnouncement(title, content) {
	//TODO validation
	displayAnnouncement({'author' : 'dummy_user', 'title' : title, 'content' : content});
	$('#modal').modal('hide');
}