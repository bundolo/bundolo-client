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

var escapeUrl = function () {
	return function(val, render) {
	    return render(val).replace(/ /g, '~');
	};
};

$.address.change(function(event) {
	//console.log('$.address.value(): ' + $.address.value());
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
  
	$('.modal').on('shown.bs.modal', function () {
		$('.default-focus').focus();
	});
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
		    switch(type) {
			    case 'text':
			    	commentParentId = data.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
			        break;
			    case 'author':
			    	commentParentId = data.descriptionContent.contentId;
			    	data.messagingEnabled = (username != "gost") && (username != data.username);
			    	data.editingEnabled = (username != "gost") && (username == data.username);
			    	switch(data.gender) {
			    		case 'male':
			    			data.gender = 'muški';
			    			break;
			    		case 'female':
			    			data.gender = 'ženski';
			    			break;
			    		case 'other':
			    			data.gender = 'x';
			    			break;
			    	}
			        break;
			    case 'topic':
			    	//topic comments are disabled to avoid confusion with posts
			    	//consider enabling comments on forum, or forum groups
			    	//commentParentId = data.contentId;
			    	commentParentId = null;
			        break;
			    case 'serial':
			    	commentParentId = data.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
			        break;
			    case 'announcement':
			    	commentParentId = data.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
			        break;
			    case 'contest':
			    	commentParentId = data.descriptionContent.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
			        break;
			    case 'connection':
			    	commentParentId = data.descriptionContent.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
			        break;
			    case 'episode':
			    	commentParentId = data.contentId;
			    	data.editingEnabled = (username != "gost") && (username == data.authorUsername) && (data.contentStatus == 'pending');
			        break;
			    default:
			        commentParentId = id;
		    }
		    data.escapeUrl = escapeUrl;
		    var rendered = Mustache.render(template, data);
		    displayContent(contentElement, rendered, commentParentId);
		    if (type == 'topic') {
		    	$.get(rootFolder+"templates/posts.html", function(templatePosts) {
		    		$.getJSON(rootPath + restRoot + "/posts", { "parentId": data.contentId, "start": 0}, function(posts) {
		    			var renderedPosts = Mustache.render(templatePosts, {"posts": posts, "escapeUrl": escapeUrl});
		    			contentElement.find('tbody').append(renderedPosts);
		    		});
		    	});
		    } else if (type == 'serial') {
		    	$.get(rootFolder+"templates/episodes.html", function(templateEpisodes) {
		    		$.getJSON(rootPath + restRoot + "/episodes", { "parentId": data.contentId }, function(episodes) {
		    			var numberOfEpisodesLabel = '0 nastavaka';
		    			if (episodes && episodes.length > 0) {
		    				if (episodes.length%100 >= 11 && episodes.length%100 <= 14) {
			    				numberOfEpisodesLabel = episodes.length + ' nastavaka';
			    			} else if (episodes.length%10 == 1) {
			    				numberOfEpisodesLabel = episodes.length + ' nastavak';
			    			} else if (episodes.length%10 >= 2 && episodes.length%10 <= 4) {
			    				numberOfEpisodesLabel = episodes.length + ' nastavka';
			    			} else {
			    				numberOfEpisodesLabel = episodes.length + ' nastavaka';
			    			}		    				
		    				data.addingEnabled = episodes[episodes.length - 1].contentStatus == 'active';
		    			} else {
		    				data.addingEnabled = true;
		    			}
		    			data.isLoggedIn = username != "gost";
		    			contentElement.find('h3').eq(1).html(numberOfEpisodesLabel);		    			
		    			var renderedEpisodes = Mustache.render(templateEpisodes, {"serial": data, "episodes": episodes, "escapeUrl": escapeUrl});
		    			contentElement.append(renderedEpisodes);
		    		});
		    	});
		    } else if (type == 'author') {
		    	$.get(rootFolder+"templates/author_statistics.html", function(templateStatistics) {
			    	$.ajax({
					    url: rootPath + restRoot + "/statistics/" + data.username,
					    type: 'GET',
					    dataType: "json",
					    contentType: "application/json; charset=utf-8",
					    beforeSend: function (xhr) {
					        xhr.setRequestHeader ("Authorization", token);
					    },
					    success: function(data) {
					    	var totalRating = 0;
					    	for (var i = 0; i < data.length; i++) {
					    		switch(data[i].kind) {
							    case 'text':
							    	data[i].isText = true;
							        break;
							    case 'episode':
							    	data[i].isEpisode = true;
							        break;
					    		}
					    		if (data[i].rating) {
					    			totalRating += data[i].rating.value;
					    		}
					    	}
					    	  //console.log(JSON.stringify(data));
					    	var renderedStatistics = Mustache.render(templateStatistics, {"items" : data, "rating" : totalRating, "escapeUrl": escapeUrl});
					    	contentElement.append(renderedStatistics);
						},
						error: function(textStatus, errorThrown) {
							//TODO
						}
					});
		    	});
		    } 
		    
		});
	});
}

function editSingleItem(type, id, event, notification) {
	if (event) {
		//this is used in content table when row has event handler and contains buttons which have their own
		event.stopPropagation();
	}
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
		} else if (type == 'confirmation') {
			editSingleItemHelper(type, null, contentElement, template, "deleteSingleItem('"+id+"');");
		} else if (type == 'notification') {
			editSingleItemHelper(type, null, contentElement, template, notification);
		} else if (type == 'message') {
			editSingleItemHelper(type, null, contentElement, template, id);
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
		    	if (type == 'episode') {
		    		episodeParentName = data.parentGroup;
		    	}
		    	var rendered = Mustache.render(template, data);
		    	contentElement.html(rendered);
		    	if (type == 'announcement' || type == 'episode' || type == 'text') {
		    		$("#edit_content").code(data.text);
		    	} else if (type == 'connection' || type == 'contest') {
		    		$("#edit_content").code(data.descriptionContent.text);
		    	}
			},
			error: function(textStatus, errorThrown) {
				//TODO
			}
		});
	} else {
		var data = {};
		if (formData) {
    		if (type == 'connection') {
    			data.connectionGroups = formData;
    		} else if (type == 'topic') {
    			data.topicGroups = formData;
    		} else if (type == 'confirmation') {
    			data.modalAction = formData;
    		} else if (type == 'notification') {
    			data.notification = formData;
    		} else if (type == 'message') {
    			data.recipientUsername = formData;
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
	//contentElement.html(spinner);
	displayContent(contentElement, homeHtml);
	$.ajax({
	    url: rootPath + restRoot + "/page/home",
	    type: 'GET',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	    	xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
	    	displayContent(contentElement, homeHtml, data.contentId);
	    	
			//do not use html from db for now we will load random comment containing word bundolo
	    	$.getJSON(rootPath + restRoot + "/comments", { "start": "0", "end": "0", "orderBy": "random,asc", "filterBy": "text,bundolo"}, function( data ) {
	    		var comment = data[0];
	    		var parentLinkUrl = "";
	    		//console.log(comment.parentContent.kind);
			  switch(comment.parentContent.kind) {
			    case 'text':
			    	parentLinkUrl = rootPath+"/text/" + comment.parentContent.authorUsername + "/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'episode':
			    	parentLinkUrl = rootPath+"/episode/" + comment.parentContent.authorUsername + "/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'episode_group':
			    	parentLinkUrl = rootPath+"/serial/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'connection_description':
			    	parentLinkUrl = rootPath+"/connection/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'contest_description':
			    	parentLinkUrl = rootPath+"/contest/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'page_description':
			    	var contentName = comment.parentContent.name;
			    	parentLinkUrl = rootPath;
			    	contentName = contentName.replace(/ /g, '~').toLowerCase();
			    	if (contentName != 'home') {
			    		parentLinkUrl += "/" + contentName;
			    	}
			        break;
			    case 'news':
			    	parentLinkUrl = rootPath+"/announcement/" + comment.parentContent.name.replace(/ /g, '~');
			        break;
			    case 'forum_group':
			    	//forum group comments are not enabled 
			        break;
			    case 'user_description':
			    	parentLinkUrl = rootPath+"/author/" + comment.parentContent.authorUsername;
			        break;
				}
  //console.log(JSON.stringify(comment));
			  var authorLink = "";
			  if (comment.authorUsername && comment.authorUsername != "gost") {
				  authorLink = "<a href='/author/"+comment.authorUsername+"'>"+comment.authorUsername+"</a>";
			  } else {
				  authorLink = "gost";
			  }
			  var mainContentText = $(".main>.jumbotron>.content>h2");
			  mainContentText.html("- <a href='"+parentLinkUrl+"'>"+comment.text+"</a> ("+authorLink+")");
	  		  });
		},
		error: function(textStatus, errorThrown) {
			editSingleItem("notification", null, null, "sadržaj bundola trenutno nije dostupan!");
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
				editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayContact() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+'templates/contact.html', function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/page/contact",
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
				editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
			}
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
		    	if (data) {
		    		switch(data.gender) {
			    		case 'male':
			    			data.gender = 'muški';
			    			break;
			    		case 'female':
			    			data.gender = 'ženski';
			    			break;
			    		case 'other':
			    			data.gender = 'x';
			    			break;
			    	}
			    	var rendered = Mustache.render(template, data);
				    displayContent(contentElement, rendered);
		    	} else {
		    		editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
		    	}		    	
			},
			error: function(textStatus, errorThrown) {
				editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayNext(type, id, orderBy, fixBy, ascending) {
	$.getJSON(rootPath + restRoot + "/next", { "type": type, "id": id, "orderBy": orderBy, "fixBy": fixBy, "ascending": ascending}, function( data ) {
		if (data) {
			//console.log(JSON.stringify(data));
			var nextItemUrl = "";
			//console.log(data.kind);
			  switch(type) {
			    case 'text':
			    	nextItemUrl = rootFolder+"text/" + data.authorUsername + "/" + data.name.replace(/ /g, '~');
			        break;
			    case 'episode':
			    	nextItemUrl = rootFolder+"episode/" + data.parentGroup.replace(/ /g, '~') + "/" + data.name.replace(/ /g, '~');
			        break;
			    case 'serial':
			    	nextItemUrl = rootFolder+"serial/" + data.name.replace(/ /g, '~');
			        break;
			    case 'connection':
			    	nextItemUrl = rootFolder+"connection/" + data.descriptionContent.name.replace(/ /g, '~');
			        break;
			    case 'contest':
			    	nextItemUrl = rootFolder+"contest/" + data.descriptionContent.name.replace(/ /g, '~');
			        break;
			    case 'announcement':
			    	nextItemUrl = rootFolder+"announcement/" + data.name.replace(/ /g, '~');
			        break;
			    case 'topic':
			    	nextItemUrl = rootFolder+"topic/" + data.name.replace(/ /g, '~');
			        break;
			    case 'author':
			    	nextItemUrl = rootFolder+"author/" + data.username;
			        break;
				}	
				$.address.value(nextItemUrl);
		}		
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
		    	if (data) {
			    	var totalRating = 0;
			    	for (var i = 0; i < data.length; i++) {
			    		switch(data[i].kind) {
					    case 'text':
					    	data[i].isText = true;
					    	data[i].isEditable = true;
					        break;
					    case 'episode':
					    	data[i].isEpisode = true;
					    	data[i].isEditable = "pending" == data[i].contentStatus;
					        break;
			    		}
			    		if (data[i].rating) {
			    			totalRating += data[i].rating.value;
			    		}
			    	}
			    	var rendered = Mustache.render(template, {"items" : data, "rating" : totalRating, "escapeUrl": escapeUrl});
				    displayContent(contentElement, rendered);
		    	} else {
		    		editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
		    	}
			},
			error: function(textStatus, errorThrown) {
				editSingleItem("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function deleteSingleItem(id) {
	$.ajax({
	    url: rootPath + restRoot + "/" + id,
	    type: 'DELETE',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
	    	if (data) {
	    		displayStatistics();
	    		$('#modal').modal('hide');
	    	} else {
	    		editSingleItem("notification", null, null, "sadržaj ne može biti obrisan!");
	    	}	    	
		},
		error: function(textStatus, errorThrown) {
			editSingleItem("notification", null, null, "sadržaj ne može biti obrisan!");
		}
	});
	return false;
}

function sendMessage(recipientUsername) {
	//TODO validation
	var messageTitle = $("#edit_title").val();
	var messageText = $("#edit_content").val();
	var message = {};
	message.title = messageTitle;
	message.text = messageText;	
	
	//console.log("message: " + JSON.stringify(message));
	$.ajax({
	  url: rootPath + restRoot + "/message/" + recipientUsername,
	  type: "POST",
	  data: JSON.stringify(message),
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
			  $('#modal').modal('hide');
		  } else {
			  editSingleItem("notification", null, null, "slanje poruke nije uspelo!");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "slanje poruke nije uspelo!");
      },
      complete: function(data) {
//	    	  console.log("complete: " + JSON.stringify(data));
      }
	});
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
			$(this).after("<div class='help-inline'>obavezno polje</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("length") >= 0 && value && value.length < 3) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>dužina nije dovoljna</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("email") >= 0 && value && !isValidEmailAddress(value)) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>mora imati format adrese elektronske pošte</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("same1") >= 0) {
			var sibling = $(this).siblings("[validators*='same2']");
			if (sibling) {
				var siblingValue = sibling.val();
				if (value != siblingValue) {
					$(this).parent().addClass("has-error");
					$(this).after("<div class='help-inline'>vrednosti moraju biti iste</div>");
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
					$(this).after("<div class='help-inline'>vrednosti moraju biti različite</div>");
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