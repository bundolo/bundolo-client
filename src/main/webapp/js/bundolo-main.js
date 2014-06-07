var rootPath = "http://localhost";
//var rootPath = "http://62.113.232.24/";
var restRoot = "/rest";
//var rootFolder = "bundolo2/";
var rootFolder = "/";
var homeHtml = "";
$.address.change(function(event) {
	//alert("address change: " +  $.address.value());
	if ($.address.value() == rootFolder) {
		displayHome();
	} else if ($.address.value() == "/about") {
		displayAbout();
	} else if ($.address.value() == "/contact") {
		displayContact();
	} else {
		var reminder = $.address.value().substr(rootFolder.length);
		var slashPos = reminder.indexOf('/');
		if (slashPos > 0) {
			//alert("address change: " + reminder.substr(0, slashPos) + ", " + reminder.substr(slashPos + 1));
			displaySingleItem(reminder.substr(0, slashPos), reminder.substr(slashPos + 1));
		}
	}
});

$(document).ready(function() {
	$('[data-toggle=offcanvas]').click(function() {
		$('.row-offcanvas').toggleClass('active');
	});
	$('body').on('mouseenter', '[title]', function(e) {
		displayStatusBar($(this).attr('title'));
	});
	$('body').on('mouseleave', '[title]', function(e) {
		displayStatusBar('');
	});
  var mainContent = $(".main>.jumbotron>.content");
  homeHtml = mainContent.html();
  addContextMenu(mainContent);
  $('#edit_content').summernote({
	  toolbar: [
	    ['style', ['style']],
	    ['font', ['bold', 'italic', 'underline', 'strike', 'clear']],
	    ['fontname', ['fontname']],
	    ['color', ['color']],
	    ['fontsize', ['fontsize']],
	    ['height', ['height']],
	    ['para', ['ul', 'ol', 'paragraph']],
	    ['insert', ['picture', 'link']], // no insert buttons
	    //['table', ['table']], // no table button
	    //['help', ['help']] //no help button
	  ]
	});
  	/*$('#edit_date').datepicker({
	    format: "dd/mm/yyyy",
	    weekStart: 1
	});*/
  	$('#edit_date').datepicker({
	    format: "dd/mm/yyyy",
	    weekStart: 1
	}).on('show', function() {
		//this is a fix for datepicker not showing when it's opened from modal dialog
  		var modal = $('#edit_date').closest('.modal');
  		var datePicker = $('body').find('.datepicker');
  		if(!modal.length) {
  			$(datePicker).css('z-index', 'auto');
  			return;
  		}
  		var zIndexModal = $(modal).css('z-index');
  		$(datePicker).css('z-index', zIndexModal + 1);
  	});
  	
  	var modalDialog = $('#modal');
  	modalDialog.on('hidden.bs.modal', function(e) {
  		modalDialog.attr('class', 'modal fade');
  		//modalDialog.removeClass("edit-comment");
  		//modalDialog.removeClass("edit-text");
	});
  	modalDialog.on('shown.bs.modal', function(e) {
  		//TODO for comments editor should be focused, but for some other content, maybe some other field
  		$('.note-editable').focus();
	});
  	modalDialog.find('.btn-primary').click(function(e) {
  		if (modalDialog.hasClass('edit-comment')) {
  			saveComment($('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-text')) {
  			saveText($('#edit_title').val(), $('#edit_description').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-serial')) {
			saveSerial($('#edit_title').val(), $('#edit_description').val());
  		} else if (modalDialog.hasClass('edit-episode')) {
			saveEpisode($('#edit_title').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-topic')) {
			saveTopic($('#edit_title').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-post')) {
			savePost($('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-announcement')) {
			saveAnnouncement($('#edit_title').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-connection')) {
			saveConnection($('#edit_title').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-contest')) {
			saveContest($('#edit_title').val(), $('#edit_date').val(), $('#edit_content').code());
  		} else if (modalDialog.hasClass('edit-inquiry')) {
  			saveInquiry($('#edit_title').val(), $('#edit_content').code());
  		}
  		
        return false;
    });
  	$('body').on('click', '.navbar .about', function(e) {
  		$.address.value('/about');
	});
  	$('body').on('click', '.navbar .contact', function(e) {
  		$.address.value('/contact');
	});
});

function displayContent(parentElement, html) {
	parentElement.html(html);
	addContextMenu(parentElement);
}
function displaySingleItem(type, id) {
	$.get(rootFolder+"templates/" + type + ".html", function(template) {
		$.getJSON(rootPath + restRoot + "/" + type + "/"+id, function(data) {
		    var rendered = Mustache.render(template, data);
		    var contentElement = $('.main>.jumbotron>.content');
		    displayContent(contentElement, rendered);
		});
	});
}
function sanitize(content) {
	//TODO make this more generic. strip all tags for some content, be selective for other
	return content.replace(/(<([^>]+)>)/ig,"");
}

function displayHome() {
	var contentElement = $('.main>.jumbotron>.content');
    contentElement.attr('class', 'content');
	displayContent(contentElement, homeHtml);
}

function displayAbout() {
	$.get(rootFolder+'templates/about.html', function(template) {
	    var rendered = Mustache.render(template, {});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content about');
	    displayContent(contentElement, rendered);
	  });
}

function displayContact() {
	$.get(rootFolder+'templates/contact.html', function(template) {
	    var rendered = Mustache.render(template, {});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content contact');
	    displayContent(contentElement, rendered);
	  });
}

function addInquiry() {
	$('#modal').addClass("edit-inquiry");
	$('#editor_label').html('Send us a message');
	$('#modal').modal('show');
}

function saveInquiry(title, content) {
	//TODO validation
	//TODO send email
	//TODO show some thank you message
	$('#modal').modal('hide');
}