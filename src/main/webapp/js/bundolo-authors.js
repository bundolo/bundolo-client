$(document).ready(function() {
	$('body').on('click', '.sidebar #collapse_authors table>tbody>tr', function(e) {
		displayDummyAuthor();
	});
});

function display_authors() {
	$.get('templates/authors.html', function(template) {
	    var rendered = Mustache.render(template, {"authors": [
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" },
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" },
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" },
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" },
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" },
                             			 			    { "date" : "04.05.2014.", "author": "some_user", "description" : "bbb0" }	
                                			 			  ]
});
	    var contentElement = $('.main>.jumbotron>.content');
	    contentElement.attr('class', 'content authors');
	    displayContent(contentElement, rendered);
	  });
}

function display_authors() {
	var authorCounter = 0;
	$.get('templates/authors.html', function(template) {
		$.get('templates/author_rows.html', function(rows_template) {
			var authors = {"authors": []};
			for ( var i = 0; i < 25; i++ ) {
				authors.authors.push(generateDummyAuthor(authorCounter));
				authorCounter++;
			}
			var rendered_rows = Mustache.render(rows_template, authors);
		    var rendered = Mustache.render(template, {}, {"author_rows" : rendered_rows});
		    var contentElement = $('.main>.jumbotron>.content');
		    displayContent(contentElement, rendered);
		    $(".main .authors").bind('scroll', function() {
		    	if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
	    			var additional_authors = {"authors": []};
	    			for ( var i = 0; i < 5; i++ ) {
	    				additional_authors.authors.push(generateDummyAuthor(authorCounter));
	    				authorCounter++;
	    			}
	    		    var rendered_rows = Mustache.render(rows_template, additional_authors);
	    		    var contentElement = $('.main>.jumbotron .authors tbody');
	    		    contentElement.append(rendered_rows);
		        }
		    });
		});
	  });
}

function addAuthor() {
	$('#modal').addClass("edit-author");
	$('#modal').modal('show');
}

function saveAuthor(author, description) {
	//TODO validation
	displayAuthor('dummy_user', date, description);
	$('#modal').modal('hide');
}

function displayAuthor(author, date, description) {
	$.get('templates/author.html', function(template) {
	    var rendered = Mustache.render(template, {"author": author, "date": date, "description": description});
	    var contentElement = $('.main>.jumbotron>.authors>.author');
	    displayContent(contentElement, rendered);
	  });
}
function displayDummyAuthor() {
	displayAuthor('kiloster', '04.05.2014.', 'Razorback sucker');
}

function generateDummyAuthor(id) {
	return { "date": "10. 05. 2014.", "author" : "dummy_user" + id, "description" : "description" + id}
}