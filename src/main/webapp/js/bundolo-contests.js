$(document).ready(function() {
});

function addContest() {
	$('#modal').addClass("edit-contest");
	$('#editor_label').html('Add contest');
	$('#modal').modal('show');
}

function saveContest(title, expiration_date, content) {
	//TODO validation
	displayContest({'author' : 'dummy_user', 'title' : title, 'content' : content});
	$('#modal').modal('hide');
}