//var rootPath = "http://localhost";
//var rootPath = "http://54.76.44.57/";

var url = window.location.href;
var arr = url.split("/");
var rootPath = arr[0] + "//" + arr[2];
var restRoot = "/rest";
var rootFolder = "/";
var homeHtml = "";
var version = "1.0.8";
var handlingForm = false;

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
var escapeUrlExtended = function () {
	return function(val, render) {
	    return render(val).replace(/ /g, '~').replace(/&#39;/g, "\\'");
	};
};

var trimLong = function () {
	return function(val, render) {
		var trimmedText = render(val);
		if (trimmedText.length > 30) {
			//trimmedText = trimmedText.substring(0, 27);
			trimmedText = trimmedText.substring(0, 27) + '...';
        }
		return trimmedText;
	};
};

var timestampDate = function () {
	return function(val, render) {
		var timestamp = render(val);
		if (timestamp) {
			var timestampDate = new Date(+render(val));
			return addZero(timestampDate.getDate()) + "." + addZero(timestampDate.getMonth()+1) + "." + timestampDate.getFullYear() + ".";
		}
		return "";
	};
};

var timestampDateTime = function () {
	return function(val, render) {
		var timestamp = new Date(+render(val));
		return addZero(timestamp.getDate()) + "." + addZero(timestamp.getMonth()+1) + "." + timestamp.getFullYear() + ". " + addZero(timestamp.getHours()) + ":" + addZero(timestamp.getMinutes());
	};
};

$.address.change(function(event) {
	loadFromAddress();
});

function loadFromAddress() {
	$('.slider').hide();
	if ($.address.value() == rootFolder) {
		displayHome();
	} else if ($.address.value() == "/about") {
		displayAbout();
	} else if ($.address.value() == "/contact") {
		displayContact();
	} else if ($.address.value() == "/profile") {
		if (username != 'gost') {
			displayProfile();
		} else {
			displayHome();
		}
	} else if ($.address.value().indexOf("/item_list") == 0 && username == 'gost') {
		displayHome();
	} else if ($.address.value() == "/statistics") {
		if (username != 'gost') {
			displayStatistics();
		} else {
			displayHome();
		}
	} else if ($.address.value().match("^/validate")) {
		validateEmail();
	} else {
		var reminder = $.address.value().substr(rootFolder.length);
		var slashPos = reminder.indexOf('/');
		if (slashPos > 0) {
			displaySingleItem(reminder.substr(0, slashPos), reminder.substr(slashPos + 1));
		}
	}
}

$(document).ready(function() {
	$('[data-toggle=offcanvas]').click(function() {
		$('.row-offcanvas').toggleClass('active');
	});
	$('body').on('mouseenter', ':not(pre>a)[title]', function(e) {
		displayStatusBar($(this).attr('title'));
	});
	$('body').on('mouseleave', ':not(pre>a)[title]', function(e) {
		displayStatusBar('');
	});
	var mainContent = $(".main>.jumbotron>.content");
	homeHtml = mainContent.html();

	$('.modal').on('shown.bs.modal', function () {
		$('.default-focus').focus();
	});
	$('.modal').on('hidden.bs.modal', function () {
		handlingForm = false;
	});

	$.li18n.currentLocale = 'sr_RS';

	$('body').on('click', '.send_message', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			sendMessage();
		}
	});
});

function displayContent(parentElement, html, contentId, contentType) {
	parentElement.html(html);
	if (contentId) {
		addContextMenu(parentElement, contentId, contentType);
	}
}

function displaySingleItem(type, id) {
	$.get(rootFolder+"templates/" + type + "-" + version + ".html", function(template) {
		$.ajax({
			  url: rootPath + restRoot + "/" + type + "/"+id.replace(/~/g, ' ').replace(/\?/g, '%3F'),
			  type: "GET",
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
						    case 'item_list':
						    	commentParentId = data.descriptionContent.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	formatItemListItems(data.items);
						        break;
						    default:
						        commentParentId = id;
					    }
					    data.escapeUrl = escapeUrlExtended;
					    data.timestampDate = timestampDate;
					    var rendered = Mustache.render(template, data);
					    displayContent(contentElement, rendered, commentParentId, type);
					    if (type == 'topic') {
					    	$.get(rootFolder+"templates/posts" + "-" + version + ".html", function(templatePosts) {
					    		$.getJSON(rootPath + restRoot + "/posts", { "parentId": data.contentId, "start": 0}, function(allPosts) {
					    			if (allPosts) {
					    				for (var i = 0; i < allPosts.length; i++) {
					    					allPosts[i].text = sanitizeRuntime(allPosts[i].text);
					    				}
					    				var pages = [];
					    				var pageSize = 10;
					    				for (var i = 0; i < allPosts.length / pageSize; i++) {
					    					var page = {"index" : i + 1, "posts" : allPosts.slice(i*pageSize, i*pageSize + pageSize)};
					    					pages.push(page);
					    				}
					    				var renderedPosts = Mustache.render(templatePosts, {"pages": pages, "escapeUrl": escapeUrl, "timestampDateTime": timestampDateTime});
						    			contentElement.find('.item-footer').before(renderedPosts);
						    			displayPage('forum-topic', pages.length);
					    			}
					    		});
					    	});
					    } else if (type == 'serial') {
					    	$.get(rootFolder+"templates/episodes" + "-" + version + ".html", function(templateEpisodes) {
					    		$.getJSON(rootPath + restRoot + "/episodes", { "parentId": data.contentId }, function(episodes) {
					    			var numberOfEpisodesLabel = '0 nastavaka';
					    			var pages = [];
				    				var pageSize = 10;
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
					    				for (var i = 0; i < episodes.length / pageSize; i++) {
					    					var page = {"index" : i + 1, "episodes" : episodes.slice(i*pageSize, i*pageSize + pageSize)};
					    					pages.push(page);
					    				}
					    			} else {
					    				data.addingEnabled = true;
					    			}
					    			data.isLoggedIn = username != "gost";
					    			contentElement.find('h3').eq(1).html(numberOfEpisodesLabel);
					    			var renderedEpisodes = Mustache.render(templateEpisodes, {"serial": data, "pages": pages, "escapeUrl": escapeUrl, "timestampDate": timestampDate});
					    			contentElement.append(renderedEpisodes);
					    			displayPage('serial-episodes', pages.length);
					    		});
					    	});
					    } else if (type == 'author') {
					    	$.get(rootFolder+"templates/author_statistics" + "-" + version + ".html", function(templateStatistics) {
						    	$.ajax({
								    url: rootPath + restRoot + "/statistics/" + data.username,
								    type: 'GET',
								    dataType: "json",
								    contentType: "application/json; charset=utf-8",
//								    beforeSend: function (xhr) {
//								        xhr.setRequestHeader ("Authorization", token);
//								    },
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
								    		if (data[i].rating[0]) {
								    			totalRating += data[i].rating[0].value;
								    		}
								    	}
								    	var pages = [];
					    				var pageSize = 10;
								    	for (var i = 0; i < data.length / pageSize; i++) {
					    					var page = {"index" : i + 1, "items" : data.slice(i*pageSize, i*pageSize + pageSize)};
					    					pages.push(page);
					    				}
								    	var renderedStatistics = Mustache.render(templateStatistics, {"pages" : pages, "rating" : totalRating, "escapeUrl": escapeUrlExtended, "timestampDate": timestampDate});
								    	contentElement.append(renderedStatistics);
								    	displayPage('author-items', pages.length);
									},
									error: function(textStatus, errorThrown) {
										//TODO
									}
								});
					    	});
					    } else if (type == 'item_list') {
					    	displayLinksInAscii();
					    }
				  } else {
					  if ($.address.value() == rootFolder && type == 'item_list') {
						  displayHomeDefault();
					  } else {
						  editSingleItem("notification", null, null, "sadržaj nije pronađen.");
					  }
				  }
		      },
		      error: function(data) {
		    	  if ($.address.value() == rootFolder && type == 'item_list') {
		    		  displayHomeDefault();
				  } else {
					  editSingleItem("notification", null, null, "sadržaj nije pronađen.");
				  }
		      }
			});

		//

	});
}

function editSingleItem(type, id, event, notification) {
	handlingForm = false;
	if (event) {
		//this is used in content table when row has event handler and contains buttons which have their own
		event.stopPropagation();
	}
	var modalElement;
	if ((type == 'notification') || (type == 'confirmation')) {
		modalElement= $('#modal-notification');
	} else {
		modalElement= $('#modal');
	}
	var contentElement = modalElement.find('.modal-content');
	contentElement.html(spinner);
	modalElement.modal('show');
	$.get(rootFolder+"templates/edit_"+type+"-" + version + ".html", function(template) {
		if (type == 'connection') {
			$.ajax({
			    url: rootPath + restRoot + "/connection_groups",
			    type: 'GET',
			    dataType: "json",
			    contentType: "application/json; charset=utf-8",
//			    beforeSend: function (xhr) {
//			        xhr.setRequestHeader ("Authorization", token);
//			    },
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
//			    beforeSend: function (xhr) {
//			        xhr.setRequestHeader ("Authorization", token);
//			    },
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
		    	data.timestampDate = timestampDate;
		    	data.escapeUrl = escapeUrlExtended;
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
    			try {
    				data.notification = $.li18n.translate(formData);
    			} catch(err) {
    				data.notification = formData;
    			}
    		} else if (type == 'message') {
    			data.recipientUsername = formData;
    		}
    	}
		data.escapeUrl = escapeUrlExtended;
		var rendered = Mustache.render(template, data);
    	contentElement.html(rendered);
    	if (type == 'comment' || type == 'post') {
    		if (username != 'gost') {
    			$("#edit_credentials>option[value='logged']").html(username);
    			$("#edit_credentials").val('logged');
    		} else {
    			$("#edit_credentials>option[value='logged']").remove();
    		}
    	}
	}
}

function sanitize(content) {
	//TODO make this more generic. strip all tags for some content, be selective for other
	//return content.replace(/(<([^>]+)>)/ig,"");
	return content;
}
function sanitizeRuntime(content) {
    var url = content.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g) || [];

    $.each(url, function(i, v) {
    	content = content.replace(v, '<a href="' + v + '">' + v + '</a>');
    });

    content = content.replace(/[\n\r]/g,"<br/>");

    return content;
}

function displayHome() {
	$('.slider').show();
	displaySingleItem("item_list", "Gde je more");
}

function displayHomeDefault() {
	var contentElement = $('.main>.jumbotron>.content');
	//contentElement.html(spinner);
	displayContent(contentElement, homeHtml);
	$.ajax({
	    url: rootPath + restRoot + "/page/home",
	    type: 'GET',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
//	    beforeSend: function (xhr) {
//	    	xhr.setRequestHeader ("Authorization", token);
//	    },
	    success: function(data) {
	    	displayContent(contentElement, homeHtml, data.contentId, "page");
			//do not use html from db for now
	    	displayRandomComment();
	    	//displayHighlightedAnnouncement('novi bundolo');
	    	displayLinksInAscii();
		},
		error: function(textStatus, errorThrown) {
			editSingleItem("notification", null, null, "sadržaj bundola trenutno nije dostupan!");
		}
	});
}

function displayAbout() {
	var contentElement = $('.main>.jumbotron>.content');
	contentElement.html(spinner);
	$.get(rootFolder+"templates/about" + "-" + version + ".html", function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/page/about",
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
//		    beforeSend: function (xhr) {
//		        xhr.setRequestHeader ("Authorization", token);
//		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, {});
			    displayContent(contentElement, rendered, data.contentId, "page");
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
	$.get(rootFolder+"templates/contact" + "-" + version + ".html", function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/page/contact",
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
//		    beforeSend: function (xhr) {
//		        xhr.setRequestHeader ("Authorization", token);
//		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, {});
			    displayContent(contentElement, rendered, data.contentId, "page");
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
	$.get(rootFolder+"templates/profile" + "-" + version + ".html", function(template) {
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
		    		data.showPersonal = data.showPersonal ? 'da' : 'ne';
		    		data.timestampDate = timestampDate;
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
			var nextItemUrl = "";
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
	$.get(rootFolder+"templates/statistics" + "-" + version + ".html", function(template) {
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
					    case 'item_list_description':
					    	data[i].isItemList = true;
					    	data[i].isEditable = true;
					        break;
			    		}
			    		if (data[i].rating[0]) {
			    			totalRating += data[i].rating[0].value;
			    		}
			    	}
			    	var pages = [];
    				var pageSize = 10;
			    	for (var i = 0; i < data.length / pageSize; i++) {
    					var page = {"index" : i + 1, "items" : data.slice(i*pageSize, i*pageSize + pageSize)};
    					pages.push(page);
    				}
			    	var rendered = Mustache.render(template, {"pages" : pages, "rating" : totalRating, "escapeUrl": escapeUrlExtended, "timestampDate": timestampDate});
				    displayContent(contentElement, rendered);
				    displayPage('profile-items', pages.length);
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
	    		if (id.indexOf("text") == 0) {
	    			refreshSliderIfNeeded("texts");
					refreshSidebarIfNeeded("texts");
	    		}
	    		$('#modal-notification').modal('hide');
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

function sendMessage() {
	if (!isFormValid($('#modal form'))) {
		return;
	}
	var messageTitle = $("#edit_title").val();
	var messageText = $("#edit_content").val();
	var recipientUsername = $("#edit_recipient").val();
	var message = {};
	message.title = messageTitle;
	message.text = messageText;
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
			  if (data == 'success') {
				  $('#modal').modal('hide');
			  } else {
				  editSingleItem("notification", null, null, data);
			  }
		  } else {
			  editSingleItem("notification", null, null, "slanje poruke nije uspelo!");
		  }
      },
      error: function(data) {
    	  editSingleItem("notification", null, null, "slanje poruke nije uspelo!");
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
		if (validators.indexOf("forbidden") >= 0 && value) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>ovo polje se koristi kao zaštita i ne sme se popunjavati</div>");
			result = false;
			return true;
		}
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
		if (validators.indexOf("url_safe") >= 0 && !/^[^~\\\/\[\]\{\}\(\);\:"'\|<>\?\+=`#$%\^&\*]+$/.test(value)) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>specijalni karakteri nisu dozvoljeni</div>");
			result = false;
			return true;
		}
		if (validators.indexOf("username") >= 0 && !/^[A-Za-z0-9 _-]{3,25}$/.test(value)) {
			$(this).parent().addClass("has-error");
			$(this).after("<div class='help-inline'>dozvoljeni karakteri su A-Za-z0-9 _-</div>");
			result = false;
			return true;
		}
	});
	if (!result) {
		handlingForm = false;
	}
	return result;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

function displayRandomComment() {
	$.getJSON(rootPath + restRoot + "/comments", { "start": "0", "end": "0", "orderBy": "random,asc", "filterBy": "text,bundolo"}, function( data ) {
		var comment = data[0];
		var parentLinkUrl = "";
		switch(comment.parentContent.kind) {
		    case 'text':
		    	parentLinkUrl = "text/" + comment.parentContent.authorUsername + "/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'episode':
		    	parentLinkUrl = "episode/" + comment.parentContent.authorUsername + "/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'episode_group':
		    	parentLinkUrl = "serial/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'connection_description':
		    	parentLinkUrl = "connection/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'contest_description':
		    	parentLinkUrl = "contest/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'page_description':
		    	var contentName = comment.parentContent.name;
		    	parentLinkUrl = "";
		    	contentName = contentName.replace(/ /g, '~').toLowerCase();
		    	if (contentName != 'home') {
		    		parentLinkUrl += contentName;
		    	}
		        break;
		    case 'news':
		    	parentLinkUrl = "announcement/" + comment.parentContent.name.replace(/ /g, '~');
		        break;
		    case 'forum_group':
		    	//forum group comments are not enabled
		        break;
		    case 'user_description':
		    	parentLinkUrl = "author/" + comment.parentContent.authorUsername;
		        break;
		}
	  var authorLink = "";
	  if (comment.authorUsername && comment.authorUsername != "gost") {
		  authorLink = '<a href="javascript:;" onclick="$.address.value(\'author/'+comment.authorUsername+'\');">'+comment.authorUsername+'</a>';
	  } else {
		  authorLink = "gost";
	  }
	  var mainContentText = $(".main>.jumbotron>.content>h2");
	  mainContentText.html('- <a href="javascript:;" onclick="$.address.value(\''+parentLinkUrl+'\');">'+comment.text+'</a> ('+authorLink+')');
	});
}

function displayHighlightedAnnouncement(id) {
	$.ajax({
		  url: rootPath + restRoot + "/announcement/"+id.replace(/~/g, ' ').replace(/\?/g, '%3F'),
		  type: "GET",
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
				  var mainContentText = $(".main>.jumbotron>.content>h2");
				  mainContentText.html('- <a href="javascript:;" onclick="$.address.value(\'announcement/'+data.name.replace(/ /g, '~')+'\');">'+data.text+'</a>');
			  }
		  }
	});
}

function displayLinksInAscii() {
	$.ajax({
	    url: rootPath + restRoot + "/recent",
	    type: 'GET',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
	    	if (data) {
	    		var asciiArt = $(".main>.jumbotron>.content>pre");
	    		var asciiArtText = asciiArt.html();
	    		var wordsArray = asciiArtText.match(/\S+/ig);
	    		wordsArray.sort(function(a, b){
	    			return b.length - a.length;
	    		});
	    		var anchors = [];
	    		for (var i = 0; i < data.length; i++) {
	    			var link = "";
	    			var title = "";
	    			var caption = "";
		    		switch(data[i].kind) {
				    case 'text':
				    	link = "text/" + data[i].authorUsername.replace(/ /g, '~') + "/" + data[i].name.replace(/ /g, '~');
				    	title = "tekst:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].authorUsername + " - " + data[i].name;
				        break;
				    case 'forum_topic':
				    	link = "topic/" + data[i].name.replace(/ /g, '~');
				    	title = "diskusija:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'connection_description':
				    	link = "connection/" + data[i].name.replace(/ /g, '~');
				    	title = "link:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'news':
				    	link = "announcement/" + data[i].name.replace(/ /g, '~');
				    	title = "vest:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'contest_description':
				    	link = "contest/" + data[i].name.replace(/ /g, '~');
				    	title = "konkurs:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'episode':
				    	link = "episode/" + data[i].parentGroup.replace(/ /g, '~') + "/" + data[i].name.replace(/ /g, '~');
				    	title = "nastavak:\r\n" + data[i].name + "\r\nserija:\r\n"+data[i].parentGroup + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].parentGroup + " - " + data[i].name;
				        break;
				    case 'user_description':
				    	link = "author/" + data[i].authorUsername.replace(/ /g, '~');
				    	title = "autor:\r\n"+data[i].authorUsername;
				    	caption = data[i].authorUsername;
				        break;
		    		}
		    		anchors.push({"caption" : caption, "link" : link.replace(/'/g, "&apos;"), "title" : title.replace(/'/g, "&apos;")});
		    	}
	    		anchors.sort(function(a, b){
	    			return b.caption.length - a.caption.length;
	    		});
	    		for (var i = 0; i < anchors.length; i++) {
	    			var tagAndReminder = "";
	    			if (wordsArray[i].length > anchors[i].caption.length) {
	    				tagAndReminder = "<a href='javascript:;' onclick='$.address.value(\""+anchors[i].link+"\");' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption + "</a>" + wordsArray[i].substring(anchors[i].caption.length);
		    		} else if (wordsArray[i].length < anchors[i].caption.length) {
		    			tagAndReminder = "<a href='javascript:;' onclick='$.address.value(\""+anchors[i].link+"\");' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption.substring(0, wordsArray[i].length) + "</a>";
		    		} else {
		    			tagAndReminder = "<a href='javascript:;' onclick='$.address.value(\""+anchors[i].link+"\");' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption + "</a>";
		    		}
	    			asciiArtText = asciiArtText.replace(wordsArray[i], tagAndReminder);
	    		}
	    		asciiArt.html(asciiArtText);
	    	} else {
	    		//do nothing
	    	}
		},
		error: function(textStatus, errorThrown) {
			//do nothing
		}
	});
}

function formatItemListItems(data) {
	if (data) {
		for (var i = 0; i < data.length; i++) {
			switch(data[i].kind) {
		    case 'text':
		    	data[i].link = "text/" + data[i].authorUsername.replace(/ /g, '~') + "/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].authorUsername + " - " + data[i].name;
		        break;
		    case 'forum_topic':
		    	data[i].link = "topic/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
		    case 'connection_description':
		    	data[i].link = "connection/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
		    case 'news':
		    	data[i].link = "announcement/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
		    case 'contest_description':
		    	data[i].link = "contest/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
		    case 'episode':
		    	data[i].link = "episode/" + data[i].parentGroup.replace(/ /g, '~') + "/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].parentGroup + " - " + data[i].name;
		        break;
		    case 'user_description':
		    	data[i].link = "author/" + data[i].authorUsername.replace(/ /g, '~');
		    	data[i].caption = data[i].authorUsername;
		        break;
		    case 'page_description':
		    	if (data[i].name.toLowerCase() != 'home') {
		    		data[i].link = data[i].name.replace(/ /g, '~').toLowerCase();
		    	} else {
		    		data[i].link = "";
		    	}
		    	data[i].caption = data[i].text;
		        break;
		    case 'item_list_description':
		    	data[i].link = "item_list/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
		    case 'episode_group':
		    	data[i].link = "serial/" + data[i].name.replace(/ /g, '~');
		    	data[i].caption = data[i].name;
		        break;
			}
			//anchors.push({"caption" : caption, "link" : link.replace(/'/g, "&apos;"), "title" : title.replace(/'/g, "&apos;")});
		}
	}
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function displayPage(pageKind, index) {
	var active = $(".pagination>li>a.active");
	if (!active.hasClass("page"+index)) {
		active.removeClass("active");
		$(".pagination>li>a.page"+index).addClass("active");
	}
	var pages = $(".main>.jumbotron>.content ." + pageKind);
	pages.addClass("hidden");
	var page = $(".main>.jumbotron>.content ." + pageKind+".page"+index);
	page.removeClass("hidden");
}