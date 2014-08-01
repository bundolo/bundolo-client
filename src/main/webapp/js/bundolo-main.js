var rootPath = "http://localhost";
//var rootPath = "http://62.113.232.24/";
var restRoot = "/rest";
//var rootFolder = "bundolo2/";
var rootFolder = "/";
var homeHtml = "";


var spinner = '<span class="fa-stack fa-2x fa-spin">\
<i class="fa fa-circle fa-stack-2x"></i>\
<i class="fa fa-stack-1x fa-inverse char1">b</i>\
<i class="fa fa-stack-1x fa-inverse char2">u</i>\
<i class="fa fa-stack-1x fa-inverse char3">n</i>\
<i class="fa fa-stack-1x fa-inverse char4">d</i>\
<i class="fa fa-stack-1x fa-inverse char5">o</i>\
<i class="fa fa-stack-1x fa-inverse char6">l</i>\
<i class="fa fa-stack-1x fa-inverse char7">o</i>\
</span>';
$.address.change(function(event) {
	//alert("address change: " +  $.address.value());
	//TODO avoid displaying content if it's already displayed
	if ($.address.value() == rootFolder) {
		displayHome();
	} else if ($.address.value() == "/about") {
		displayAbout();
	} else if ($.address.value() == "/contact") {
		displayContact();
	} else if ($.address.value() == "/profile" && username != 'gost') {
		displayProfile();
	} else if ($.address.value() == "/statistics" && username != 'gost') {
		displayStatistics();
	} else if ($.address.value().match("^/validate")) {
		validateEmail();
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
});

function displayContent(parentElement, html, contentId) {
	parentElement.html(html);
	if (contentId) {
		addContextMenu(parentElement, contentId);
	}	
}
function displaySingleItem(type, id) {
	$.get(rootFolder+"templates/" + type + ".html", function(template) {
		//console.log('id: ' + id);
		//console.log('path: ' + rootPath + restRoot + "/" + type + "/"+id.replace(/~/g, ' '));
		$.getJSON(rootPath + restRoot + "/" + type + "/"+id.replace(/~/g, ' '), function(data) {		    
		    var contentElement = $('.main>.jumbotron>.content');
		    var commentParentId = id;
		    //TODO go through all type of content and set appropriate contentId. sometimes it's description id, sometimes it's this item
//		    alert("data: " + data);
		    switch(type) {
			    case 'text':
			    	commentParentId = data.description[0].contentId;
			        break;
			    case 'author':
			    	commentParentId = data.descriptionContent.contentId;
			        break;
			    case 'topic':
			    	commentParentId = data.contentId;
			        break;
			    case 'serial':
			    	commentParentId = data.contentId;
			        break;
			    case 'announcement':
			    	commentParentId = data.contentId;
			        break;
			    case 'contest':
			    	commentParentId = data.descriptionContent.contentId;
			        break;
			    case 'connection':
			    	commentParentId = data.descriptionContent.contentId;
			        break;
			    default:
			        commentParentId = id;
		    }
		    var rendered = Mustache.render(template, data);
		    displayContent(contentElement, rendered, commentParentId);
		    if (type == 'topic') {
		    	$.get(rootFolder+"templates/posts.html", function(templatePosts) {
		    		$.getJSON(rootPath + restRoot + "/posts", { "parentId": data.contentId, "start": 0}, function(posts) {
		    			var renderedPosts = Mustache.render(templatePosts, {"posts": posts});
		    			contentElement.find('tbody').append(renderedPosts);
		    		});
		    	});
		    } else if (type == 'serial') {
		    	$.get(rootFolder+"templates/episodes.html", function(templateEpisodes) {
		    		$.getJSON(rootPath + restRoot + "/episodes", { "parentId": data.contentId }, function(episodes) {
		    			var renderedEpisodes = Mustache.render(templateEpisodes, {"serial": data, "episodes": episodes});
		    			contentElement.append(renderedEpisodes);
		    		});
		    	});
		    }
		});
	});
}

function editSingleItem(type, id) {
	var contentElement = $('#modal .modal-content');
	contentElement.html(spinner);
	$('#modal').modal('show');
	$.get(rootFolder+'templates/edit_'+type+'.html', function(template) {
		if (type == 'connection') {
			$.ajax({
			    url: rootPath + restRoot + "/connection_groups",
			    type: 'GET',
			    dataType: "json",
			    contentType: "application/json; charset=utf-8",
			    beforeSend: function (xhr) {
			        xhr.setRequestHeader ("Authorization", token);
			    },
			    success: function(data) {
			    	editSingleItemHelper(type, id, contentElement, template, data);
				},
				error: function(textStatus, errorThrown) {
					//TODO
				}
			});
		} else if (type == 'topic') {
			$.ajax({
			    url: rootPath + restRoot + "/topic_groups",
			    type: 'GET',
			    dataType: "json",
			    contentType: "application/json; charset=utf-8",
			    beforeSend: function (xhr) {
			        xhr.setRequestHeader ("Authorization", token);
			    },
			    success: function(data) {
			    	editSingleItemHelper(type, id, contentElement, template, data);
				},
				error: function(textStatus, errorThrown) {
					//TODO
				}
			});		
		} else {
			editSingleItemHelper(type, id, contentElement, template);
		}
	});
}

function editSingleItemHelper(type, id, contentElement, template, formData) {
	if (id) {
		$.ajax({
		    url: rootPath + restRoot + "/"+type+"/" + id,
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    success: function(data) {
		    	if (formData) {
		    		if (type == 'connection') {
		    			data.connectionGroups = formData;
		    		} else if (type == 'topic') {
		    			data.topicGroups = formData;
		    		}		    		
		    	}
		    	var rendered = Mustache.render(template, data);
		    	contentElement.html(rendered);
			},
			error: function(textStatus, errorThrown) {
				//TODO
				//alert("pic: "+ textStatus + ", mic: " + errorThrown);
			}
		});
	} else {
		var data = {};
		if (formData) {
    		if (type == 'connection') {
    			data.connectionGroups = formData;
    		} else if (type == 'topic') {
    			data.topicGroups = formData;
    		}		    		
    	}
		var rendered = Mustache.render(template, data);
    	contentElement.html(rendered);
	}
}

function sanitize(content) {
	//TODO make this more generic. strip all tags for some content, be selective for other
	return content.replace(/(<([^>]+)>)/ig,"");
}

function displayHome() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.ajax({
	    url: rootPath + restRoot + "/page/home",
	    type: 'GET',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	    	xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
			//do not use html from db for now
		    displayContent(contentElement, homeHtml, data.contentId);
		},
		error: function(textStatus, errorThrown) {
			alert("pic: "+ textStatus + ", mic: " + errorThrown);
		}
	});
}

function displayAbout() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+'templates/about.html', function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/page/about",
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, {});
			    displayContent(contentElement, rendered, data.contentId);
			},
			error: function(textStatus, errorThrown) {
				//TODO
				alert("pic: "+ textStatus + ", mic: " + errorThrown);
			}
		});
	});
}

function displayContact() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+'templates/contact.html', function(template) {
		$.getJSON(rootPath + restRoot + "/page/contact", function(data) {
			//do not use html from db for now
			var rendered = Mustache.render(template, {});
		    displayContent(contentElement, rendered, data.contentId);
		});
	});
}

function displayProfile() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+'templates/profile.html', function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/author/" + username,
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, data);
			    displayContent(contentElement, rendered);
			},
			error: function(textStatus, errorThrown) {
				//TODO
				//alert("pic: "+ textStatus + ", mic: " + errorThrown);
			}
		});
	});
}

function displayStatistics() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+'templates/statistics.html', function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/statistics/" + username,
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", token);
		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, data);
			    displayContent(contentElement, rendered);
			},
			error: function(textStatus, errorThrown) {
				//TODO
				//alert("pic: "+ textStatus + ", mic: " + errorThrown);
			}
		});
	});
}

function saveInquiry() {
	//TODO validation
	//TODO send email
	//TODO show some thank you message
	$('#modal').modal('hide');
}

function isFormValid(formElement) {
	var result = true;
	formElement.find('.help-inline').remove();
	formElement.find('.form-group').removeClass("has-error");
	formElement.find('[validators]').each(function() {
		var validators = $(this).attr('validators');
		var value = $(this).val();
		if (validators.indexOf("required") >= 0 && !value) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>required</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("length") >= 0 && value && value.length < 3) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>not long enough</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("email") >= 0 && value && !isValidEmailAddress(value)) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>not valid email address</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("same1") >= 0) {
			var sibling = $(this).siblings("[validators*='same2']");
			if (sibling) {
				var siblingValue = sibling.val();
				if (value != siblingValue) {
					$(this).parent().addClass("has-error");
					$(this).after("<div class='help-inline'>values must match</div>");
					result = false;
					return true;
				}
			}
		}
		if (validators.indexOf("different1") >= 0 && value) {
			var sibling = $(this).siblings("[validators*='different2']");
			if (sibling) {
				var siblingValue = sibling.val();
				if (!siblingValue || value == siblingValue) {
					$(this).parent().addClass("has-error");
					$(this).after("<div class='help-inline'>values must not be same</div>");
					result = false;
					return true;
				}
			}
		}
	});
	return result;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}