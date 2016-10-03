//var rootPath = "http://localhost";
//var rootPath = "http://54.76.44.57/";

var url = window.location.href;
var arr = url.split("/");
var rootPath = arr[0] + "//" + arr[2];
var restRoot = "/rest";
var rootFolder = "/";
var homeHtml = "";
var version = "1.2.1";
var handlingForm = false;
var mainContentPath = 'body>div.wrapper>div.content-wrapper';
var mainFormPath = 'body>div.wrapper>div.content-wrapper>.content>div>div>form';

var spinner = '<span class="spinner"><img class="center-block" width="60" height="60" src="/images/spinner.gif"></span>';

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

var translate = function () {
	return function(val, render) {
	    return $.li18n.translate(render(val));
	};
};

var slugify = function () {
	return function(val, render) {
		return slugifyText(render(val));
	};
};

$.address.change(function(event) {
	loadFromAddress();
});

function loadFromAddress() {
	$('.sidebar-menu>li').removeClass('active');
	var escapedFragmentIndex = $.address.value().indexOf("_escaped_fragment_=");
	if (escapedFragmentIndex >= 0) {
		//if escaped fragment is present, we remove it from address, which will trigger $.address.change again
		$.address.value($.address.value().substring(0, escapedFragmentIndex - 1));
		return;
	}
	if ($.address.value() == rootFolder) {
		displayHome();
	} else if ($.address.value() == "/about") {
		displayAbout();
	} else if ($.address.value() == "/help") {
		displayHelp();
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
	} else if ($.address.value() == "/user_items") {
		if (username != 'gost') {
			displayUserItems();
		} else {
			displayHome();
		}
	} else if ($.address.value() == "/updates") {
		if (username != 'gost') {
			displayUpdates();
		} else {
			displayHome();
		}
	} else if ($.address.value() == "/author_interactions") {
		if (username != 'gost') {
			displayAuthorInteractions();
		} else {
			displayHome();
		}
	} else if ($.address.value().indexOf("/list") == 0) {
		displayList($.address.value().substring(6));
	} else if ($.address.value().match("^/validate")) {
		validateEmail();
	} else {
		displaySingleItem($.address.value().substr(rootFolder.length));
	}
}

$(document).ready(function() {
	var mainContent = $(mainContentPath);
	homeHtml = mainContent.html();
	$.li18n.currentLocale = 'sr_RS';

	$('body').on('click', '.send_message', function(e) {
		if (!handlingForm) {
			handlingForm = true;
			sendMessage();
		}
	});

	$('body').on('click', '.sidebar-menu>li>a', function(e) {
		$(e.target).closest('li').addClass('active');
	});
});

function displayContent(parentElement, html, contentId, contentType, contentTitle) {
	parentElement.html(html);
	randomHeaderBackground();
	var pageDescription = "bundolo dibidus volšebna književna raskrsnica";
	if (contentType) {
		if (contentType == "page") {
			if (contentTitle) {
				document.title = $.li18n.translate(contentTitle) + " - bundolo";
				pageDescription = $.li18n.translate(contentTitle) + " " + pageDescription;
			} else {
				document.title = "bundolo";
			}
		} else {
			document.title = $.li18n.translate(contentType) + " - "+contentTitle + " - bundolo";
			pageDescription = $.li18n.translate(contentType) + " " + contentTitle + " " + pageDescription;
		}
	} else if (contentTitle) {
		document.title = $.li18n.translate(contentTitle) + " - bundolo";
		pageDescription = $.li18n.translate(contentTitle) + " " + pageDescription;
	}
	$('meta[name=description]').attr('content', pageDescription);
	$('meta[property=og\\:url]').attr('content', rootPath+$.address.value());
	$('meta[property=og\\:type]').attr('content', "website");
	$('meta[property=og\\:title]').attr('content', document.title);
	$('meta[property=og\\:description]').attr('content', pageDescription);
	$('meta[property=og\\:image]').attr('content', "http://www.bundolo.org/images/index.jpg");
	$('meta[property=og\\:image\\:width]').attr('content', "300");
	$('meta[property=og\\:image\\:height]').attr('content', "412");
	if (contentId) {
		addContextMenu(parentElement, contentId, contentType);
	}
}

function displaySingleItem(slug) {
	var type = slug.substr(0, slug.indexOf('/'));
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	$(".main-footer>.row").html("");
	$.get(rootFolder+"templates/" + type + "-" + version + ".html", function(template) {
		$.ajax({
			  url: rootPath + restRoot + "/" + slug,
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
					    var commentParentId = slug;
					    var pageTitle = "";
					    switch(type) {
						    case 'text':
						    	commentParentId = data.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	pageTitle = data.authorUsername + " - " + data.name;
						    	displayFooterLinks([{"previous": {"type": 'text', "id": data.contentId, "orderBy": 'date', "fixBy": 'author', "ascending": false}, "description": "od istog autora", "next": {"type": 'text', "id": data.contentId, "orderBy": 'date', "fixBy": 'author', "ascending": true}},
							                        {"previous": {"type": 'text', "id": data.contentId, "orderBy": 'title', "fixBy": '', "ascending": false}, "description": "po naslovu", "next": {"type": 'text', "id": data.contentId, "orderBy": 'title', "fixBy": '', "ascending": true}},
							                        {"previous": {"type": 'text', "id": data.contentId, "orderBy": 'date', "fixBy": '', "ascending": false}, "description": "po datumu", "next": {"type": 'text', "id": data.contentId, "orderBy": 'date', "fixBy": '', "ascending": true}},
							                        {"previous": {"type": 'text', "id": data.contentId, "orderBy": 'activity', "fixBy": '', "ascending": false}, "description": "po poslednjoj aktivnosti", "next": {"type": 'text', "id": data.contentId, "orderBy": 'activity', "fixBy": '', "ascending": true}}]);
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
						    	pageTitle = data.username;
						    	data.avatarUrl = getAvatarUrl(data.descriptionContent.avatarUrl, 120);
						    	break;
						    case 'topic':
						    	commentParentId = data.contentId;
						    	//commentParentId = null;
						    	pageTitle = data.name;
						        break;
						    case 'serial':
						    	commentParentId = data.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	pageTitle = data.name;
						    	data.isPending = "pending" == data.contentStatus;
						        break;
						    case 'announcement':
						    	commentParentId = data.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	pageTitle = data.name;
						        break;
						    case 'contest':
						    	commentParentId = data.descriptionContent.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	pageTitle = data.descriptionContent.name;
						        break;
						    case 'connection':
						    	commentParentId = data.descriptionContent.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	pageTitle = data.descriptionContent.name;
						        break;
						    case 'episode':
						    	commentParentId = data.contentId;
						    	data.isAuthor = (username != "gost") && (username == data.authorUsername);
						    	data.editingEnabled = data.isAuthor && ((data.contentStatus == 'pending') || (data.parent.contentStatus == 'pending'));
						    	pageTitle = data.name;
						        break;
						    case 'item_list':
						    	commentParentId = data.descriptionContent.contentId;
						    	data.editingEnabled = (username != "gost") && (username == data.authorUsername);
						    	formatItemListItems(data.items);
						    	pageTitle = data.descriptionContent.name;
						        break;
						    default:
						        commentParentId = slug;
					    }
					    data.timestampDate = timestampDate;
					    data.slugify = slugify;
					    var rendered = Mustache.render(template, data);
					    displayContent(contentElement, rendered, commentParentId, type, pageTitle);
					    if (type == 'topic') {
					    	contentElement.find('.posts-root').append(spinner);
					    	$.get(rootFolder+"templates/posts" + "-" + version + ".html", function(templatePosts) {
					    		$.getJSON(rootPath + restRoot + "/posts", { "parentId": data.contentId, "start": 0}, function(allPosts) {
					    			if (allPosts) {
					    				for (var i = 0; i < allPosts.length; i++) {
					    					allPosts[i].text = sanitizeRuntime(allPosts[i].text);
					    					allPosts[i].avatarUrl = getAvatarUrl(allPosts[i].avatarUrl, 40);
					    				}
					    				var pages = [];
					    				var pageSize = 10;
					    				for (var i = 0; i < allPosts.length / pageSize; i++) {
					    					var page = {"index" : i + 1, "posts" : allPosts.slice(i*pageSize, i*pageSize + pageSize)};
					    					pages.push(page);
					    				}
					    				var renderedPosts = Mustache.render(templatePosts, {"pages": pages, "timestampDateTime": timestampDateTime, "slugify" : slugify});
						    			contentElement.find('.posts-root>.spinner').replaceWith(renderedPosts);
						    			displayPage('forum-topic', pages.length);
					    			}
					    		});
					    	});
					    } else if (type == 'serial') {
					    	contentElement.find('.episodes-root').append(spinner);
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
					    				data.addingEnabled = ("pending" == data.contentStatus) || (episodes[episodes.length - 1].contentStatus == 'active');
					    				for (var i = 0; i < episodes.length / pageSize; i++) {
					    					var page = {"index" : i + 1, "episodes" : episodes.slice(i*pageSize, i*pageSize + pageSize)};
					    					pages.push(page);
					    				}
					    			} else {
					    				data.addingEnabled = true;
					    			}
					    			data.isLoggedIn = username != "gost";
					    			contentElement.find('h3').eq(1).html(numberOfEpisodesLabel);
					    			var renderedEpisodes = Mustache.render(templateEpisodes, {"serial": data, "pages": pages, "timestampDate": timestampDate});
					    			contentElement.find('.episodes-root>.spinner').replaceWith(renderedEpisodes);
					    			displayPage('serial-episodes', pages.length);
					    		});
					    	});
					    } else if (type == 'author') {
					    	displayListItems("author_items", "date,desc", null, null, "/" + data.descriptionContent.slug);
					    } else if (type == 'item_list') {
					    	displayLinksInAscii();
					    }
				  } else {
					  if ($.address.value() == rootFolder && type == 'item_list') {
						  displayHomeDefault();
					  } else {
						  displayModal("notification", null, null, "sadržaj nije pronađen.");
					  }
				  }
		      },
		      error: function(data) {
		    	  if ($.address.value() == rootFolder && type == 'item_list') {
		    		  displayHomeDefault();
				  } else {
					  displayModal("notification", null, null, "sadržaj nije pronađen.");
				  }
		      }
			});

		//

	});
}

function editSingleItem(type, slug, event, notification) {
	handlingForm = false;
	if (event) {
		//this is used in content table when row has event handler and contains buttons which have their own
		event.stopPropagation();
	}
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	if (type.indexOf('_description') > 0) {
		type = type.substring(0, type.indexOf('_description'));
	}
	$.get(rootFolder+"templates/edit_"+type+"-" + version + ".html", function(template) {
		if (type == 'connection') {
			$.ajax({
			    url: rootPath + restRoot + "/connection_groups",
			    type: 'GET',
			    dataType: "json",
			    contentType: "application/json; charset=utf-8",
			    success: function(data) {
			    	editSingleItemHelper(type, slug, contentElement, template, data);
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
			    success: function(data) {
			    	editSingleItemHelper(type, slug, contentElement, template, data);
				},
				error: function(textStatus, errorThrown) {
					//TODO
				}
			});
		} else if (type == 'item_list') {
			$.getJSON(rootPath + restRoot + "/item_lists", { "start": 0, "end": 0, "orderBy": "date,desc", "filterBy": "kind,general"}, function( generalItemLists ) {
				$.getJSON(rootPath + restRoot + "/item_lists", { "start": 0, "end": 0, "orderBy": "date,desc", "filterBy": "kind,elected"}, function( electedItemLists ) {
					var data = {};
					data.hasGeneral = generalItemLists && generalItemLists.length > 0;
					data.hasElected = electedItemLists && electedItemLists.length > 0;
					editSingleItemHelper(type, slug, contentElement, template, data);
				});
			});
		} else if (type == 'confirmation') {
			editSingleItemHelper(type, null, contentElement, template, "deleteSingleItem('"+slug+"');");
		} else if (type == 'notification') {
			editSingleItemHelper(type, null, contentElement, template, notification);
		} else if (type == 'message') {
			editSingleItemHelper(type, null, contentElement, template, slug);
		} else {
			editSingleItemHelper(type, slug, contentElement, template);
		}
	});
}

function editSingleItemHelper(type, slug, contentElement, template, formData) {
	if (slug) {
		$.ajax({
		    url: rootPath + restRoot + "/" + slug,
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
		    		} else if (type == 'item_list') {
		    			data.commonItemLists = formData;
		    			data.isGeneral = data.kind == "general";
		    			data.isElected = data.kind == "elected";
		    		}
		    	}
		    	if (type == 'episode') {
		    		data.isPending = "pending" == data.contentStatus;
		    		episodeParentId = data.parent.contentId;
		    	} else if (type == 'serial') {
		    		data.isPending = "pending" == data.contentStatus;
		    	} else if (type == 'author') {
		    		data.bulletinSubscription = data.newsletterSubscriptions.indexOf('bulletin') >= 0;
		    		data.digestSubscription = data.newsletterSubscriptions.indexOf('daily')>=0?'daily':data.newsletterSubscriptions.indexOf('weekly')>=0?'weekly':data.newsletterSubscriptions.indexOf('monthly')>=0?'monthly':'none';
		    	}
		    	data.timestampDate = timestampDate;
		    	var rendered = Mustache.render(template, data);
		    	contentElement.html(rendered);
		    	document.title = "izmena - " + $.li18n.translate(type) + " - bundolo";
		    	randomHeaderBackground();
		    	$('.default-focus').focus();
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
    		} else if (type == 'item_list') {
    			data.commonItemLists = formData;
    			data.isGeneral = data.kind == "general";
    			data.isElected = data.kind == "elected";
    		} else if (type == 'confirmation') {
    			data.modalAction = formData;
    		} else if (type == 'notification') {
    			try {
    				data.notification = $.li18n.translate(formData);
    			} catch(err) {
    				data.notification = formData;
    			}
    		} else if (type == 'message') {
    			data.recipientSlug = formData;
    		}
    	}
		var rendered = Mustache.render(template, data);
    	contentElement.html(rendered);
    	document.title = "unos - " + $.li18n.translate(type) + " - bundolo";
    	randomHeaderBackground();
    	$('.default-focus').focus();
	}
}

function cancelEdit(toDestroy) {
	$(toDestroy).destroy();
	loadFromAddress();
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
	//displaySingleItem("item_list", "Gde je more");
	displayHomeDefault();
}

function displayHomeDefault() {
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	//displayContent(contentElement, homeHtml);
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
	    	//displayRandomComment();
	    	displayHighlightedAnnouncement();
	    	displayLinksInAscii();
	    	displayRecent();
		},
		error: function(textStatus, errorThrown) {
			displayModal("notification", null, null, "sadržaj bundola trenutno nije dostupan!");
		}
	});
}

function displayAbout() {
	var contentElement = $(mainContentPath);
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
			    displayContent(contentElement, rendered, data.contentId, "page", "about");
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayHelp() {
	var contentElement = $(mainContentPath);
	$.get(rootFolder+"templates/help" + "-" + version + ".html", function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/page/help",
		    type: 'GET',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
//		    beforeSend: function (xhr) {
//		        xhr.setRequestHeader ("Authorization", token);
//		    },
		    success: function(data) {
		    	//do not use html from db for now
		    	var rendered = Mustache.render(template, {});
			    displayContent(contentElement, rendered, data.contentId, "page", "help");
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayContact() {
	var contentElement = $(mainContentPath);
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
			    displayContent(contentElement, rendered, data.contentId, "page", "contact");
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayProfile() {
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	$.get(rootFolder+"templates/profile" + "-" + version + ".html", function(template) {
		$.ajax({
		    url: rootPath + restRoot + "/" + slug,
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
		    		data.avatarUrl = getAvatarUrl(data.descriptionContent.avatarUrl, 120);
		    		data.timestampDate = timestampDate;
		    		var rendered = Mustache.render(template, data);
				    displayContent(contentElement, rendered, null, null, "profile");
		    	} else {
		    		displayModal("notification", null, null, "stranica trenutno nije dostupna!");
		    	}
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
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
			    	nextItemUrl = rootFolder+data.slug;
			        break;
			    case 'episode':
			    	nextItemUrl = rootFolder+data.slug;
			        break;
			    case 'serial':
			    	nextItemUrl = rootFolder+data.slug;
			        break;
			    case 'connection':
			    	nextItemUrl = rootFolder+data.descriptionContent.slug;
			        break;
			    case 'contest':
			    	nextItemUrl = rootFolder+data.descriptionContent.slug;
			        break;
			    case 'announcement':
			    	nextItemUrl = rootFolder+data.slug;
			        break;
			    case 'topic':
			    	nextItemUrl = rootFolder+data.slug;
			        break;
			    case 'author':
			    	nextItemUrl = rootFolder+data.descriptionContent.slug;
			        break;
				}
				$.address.value(nextItemUrl);
		}
	});
}

function displayUserItems() {
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	$.get(rootFolder+"templates/user_items" + "-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {"slug" : slug});
		displayContent(contentElement, rendered, null, null, "user_items");
		displayListItems("user_items", "date,desc", null, null, "/" + slug);
	});
}

function displayUpdates() {
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	$.get(rootFolder+"templates/updates" + "-" + version + ".html", function(template) {
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
		    		for (var i = 0; i < data.length; i++) {
		    			if (data[i].kind == 'user_description') {
		    				data[i].isAuthor = true;
		    			}
		    		}
			    	var pages = [];
    				var pageSize = 10;
			    	for (var i = 0; i < data.length / pageSize; i++) {
    					var page = {"index" : i + 1, "items" : data.slice(i*pageSize, i*pageSize + pageSize)};
    					pages.push(page);
    				}
			    	var rendered = Mustache.render(template, {"pages" : pages, "timestampDate": timestampDate, "translate": translate});
				    displayContent(contentElement, rendered, null, null, "updates");
				    displayPage('recent-updates', pages.length);
		    	} else {
		    		displayModal("notification", null, null, "stranica trenutno nije dostupna!");
		    	}
			},
			error: function(textStatus, errorThrown) {
				displayModal("notification", null, null, "stranica trenutno nije dostupna!");
			}
		});
	});
}

function displayAuthorInteractions() {
	var contentElement = $(mainContentPath);
	contentElement.html(spinner);
	$.get(rootFolder+"templates/author_interactions" + "-" + version + ".html", function(template) {
		var rendered = Mustache.render(template, {"slug" : slug});
		displayContent(contentElement, rendered, null, null, "author_interactions");
		displayListItems("author_interactions", "activity,desc", null, null, "/" + slug);
	});
}

function deleteSingleItem(slug) {
	$.ajax({
	    url: rootPath + restRoot + "/" + slug,
	    type: 'DELETE',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader ("Authorization", token);
	    },
	    success: function(data) {
	    	if (data) {
	    		displayUserItems();
	    		$('#modal-notification').modal('hide');
	    	} else {
	    		displayModal("notification", null, null, "sadržaj ne može biti obrisan!");
	    	}
		},
		error: function(textStatus, errorThrown) {
			displayModal("notification", null, null, "sadržaj ne može biti obrisan!");
		}
	});
	return false;
}

function sendMessage() {
	if (!isFormValid($(mainFormPath))) {
		return;
	}
	var messageTitle = $("#edit_title").val();
	var messageText = $("#edit_content").code();
	var recipientSlug = $("#edit_recipient").val();
	var message = {};
	message.title = messageTitle;
	message.text = messageText;
	$.ajax({
	  url: rootPath + restRoot + "/message/" + recipientSlug,
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
				  $('#edit_content').destroy();
				  loadFromAddress();
			  } else {
				  displayModal("notification", null, null, data);
			  }
		  } else {
			  displayModal("notification", null, null, "slanje poruke nije uspelo!");
		  }
      },
      error: function(data) {
    	  displayModal("notification", null, null, "slanje poruke nije uspelo!");
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
		//url_safe validator is disabled since we use slugs
//		if (validators.indexOf("url_safe") >= 0 && !/^[^~\\\/\[\]\{\}\(\);\:"'\|<>\?\+=`#$%\^&\*]+$/.test(value)) {
//			$(this).parent().addClass("has-error");
//			$(this).after("<div class='help-inline'>specijalni karakteri nisu dozvoljeni</div>");
//			result = false;
//			return true;
//		}
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
	$.getJSON(rootPath + restRoot + "/comments", { "start": 0, "end": 0, "orderBy": "random,asc", "filterBy": "text,bundolo"}, function( data ) {
		var comment = data[0];
	  var authorLink = "";
	  if (comment.authorUsername && comment.authorUsername != "gost") {
		  authorLink = '<a href="/author/'+slugifyText(comment.authorUsername)+'" onclick="$.address.value(\'/author/'+slugifyText(comment.authorUsername)+'\');return false;">'+comment.authorUsername+'</a>';
	  } else {
		  authorLink = "gost";
	  }
	  var mainContentText = $(".main>.jumbotron>.content>h2");
	  mainContentText.html('- <a href="/'+comment.parentContent.slug+'" onclick="$.address.value(\'/'+comment.parentContent.slug+'\');return false;">'+comment.text+'</a> ('+authorLink+')');
	});
}

function displayHighlightedAnnouncement() {
	$.getJSON(rootPath + restRoot + "/item_lists", { "start": 0, "end": 0, "orderBy": "date,desc", "filterBy": "kind,general"}, function( generalItemLists ) {
		if (generalItemLists && generalItemLists.length > 0) {
			var itemList = generalItemLists[0];
			if (itemList.query && itemList.query != "") {
				$.getJSON(rootPath + restRoot + "/item_list_items/" + itemList.descriptionContent.slug, { "start": 0, "end": 0, "orderBy": "date,desc", "filterBy": ""}, function( data ) {
					if (data && data.length > 0) {
						var announcement = data[0];
						var highlightedAnnouncement = $(mainContentPath + " .highlighted_announcement");
						highlightedAnnouncement.html('<h4><a href="/'+announcement.slug+'" onclick="$.address.value(\'/'+announcement.slug+'\');return false;">'+announcement.name+'</a></h4>' + announcement.text);

						highlightedAnnouncement.closest(".row").show();
					}
				});
			}
		}
	});
}

function displayLinksInAscii() {
	var asciiArt = $(".content pre");
	if (asciiArt.length) {
		$.getJSON(rootPath + restRoot + "/recent", { "limit": "105" }, function(data) {
			if (data) {
	    		var asciiArtText = asciiArt.html();
	    		var wordsArray = asciiArtText.match(/\S+/ig);
	    		wordsArray.sort(function(a, b){
	    			return b.length - a.length;
	    		});
	    		var anchors = [];
	    		for (var i = 0; i < data.length; i++) {
	    			var title = "";
	    			var caption = "";
		    		switch(data[i].kind) {
				    case 'text':
				    	title = "tekst:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].authorUsername + " - " + data[i].name;
				        break;
				    case 'forum_topic':
				    	title = "diskusija:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'connection_description':
				    	title = "link:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'news':
				    	title = "vest:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'contest_description':
				    	title = "konkurs:\r\n" + data[i].name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].name;
				        break;
				    case 'episode':
				    	title = "nastavak:\r\n" + data[i].name + "\r\nserija:\r\n"+data[i].parent.name + "\r\nautor:\r\n"+data[i].authorUsername;
				    	caption = data[i].parent.name + " - " + data[i].name;
				        break;
				    case 'user_description':
				    	title = "autor:\r\n"+data[i].authorUsername;
				    	caption = data[i].authorUsername;
				        break;
		    		}
		    		anchors.push({"caption" : caption, "link" : data[i].slug, "title" : title.replace(/'/g, "&apos;")});
		    	}
	    		anchors.sort(function(a, b){
	    			return b.caption.length - a.caption.length;
	    		});
	    		for (var i = 0; i < anchors.length; i++) {
	    			var tagAndReminder = "";
	    			if (wordsArray[i].length > anchors[i].caption.length) {
	    				tagAndReminder = "<a href='/"+anchors[i].link+"' onclick='$.address.value(\""+anchors[i].link+"\");return false;' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption + "</a>" + wordsArray[i].substring(anchors[i].caption.length);
		    		} else if (wordsArray[i].length < anchors[i].caption.length) {
		    			tagAndReminder = "<a href='/"+anchors[i].link+"' onclick='$.address.value(\""+anchors[i].link+"\");return false;' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption.substring(0, wordsArray[i].length) + "</a>";
		    		} else {
		    			tagAndReminder = "<a href='/"+anchors[i].link+"' onclick='$.address.value(\""+anchors[i].link+"\");return false;' data-toggle='tooltip' title='"+anchors[i].title+"'>" + anchors[i].caption + "</a>";
		    		}
	    			asciiArtText = asciiArtText.replace(wordsArray[i], tagAndReminder);
	    		}
	    		asciiArt.html(asciiArtText);
	    	} else {
	    		//do nothing
	    	}
		});
	}
}

function formatItemListItems(data) {
	if (data) {
		for (var i = 0; i < data.length; i++) {
			switch(data[i].kind) {
		    case 'text':
		    	data[i].caption = data[i].authorUsername + " - " + data[i].name;
		        break;
		    case 'forum_topic':
		    	data[i].caption = data[i].name;
		        break;
		    case 'connection_description':
		    	data[i].caption = data[i].name;
		        break;
		    case 'news':
		    	data[i].caption = data[i].name;
		        break;
		    case 'contest_description':
		    	data[i].caption = data[i].name;
		        break;
		    case 'episode':
		    	data[i].caption = data[i].parent.name + " - " + data[i].name;
		        break;
		    case 'user_description':
		    	data[i].caption = data[i].authorUsername;
		        break;
		    case 'page_description':
		    	data[i].caption = data[i].text;
		        break;
		    case 'item_list_description':
		    	data[i].caption = data[i].name;
		        break;
		    case 'episode_group':
		    	data[i].caption = data[i].name;
		        break;
			}
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

	var pages = $(mainContentPath + " ." + pageKind);
	pages.addClass("hidden");
	var page = $(mainContentPath + " ." + pageKind+".page"+index);
	page.removeClass("hidden");
}

//takes array of arrays and makes array of tuples
function rearrangeDataForTable(data) {
	var result = [];
	if (data && data.constructor === Array) {
		for (resultIndex in data[0]) {
			var resultEntry = [];
			for (dataIndex in data) {
				resultEntry.push(data[dataIndex][resultIndex]);
			}
			result.push({"entry": resultEntry});
		}
	}
	return result;
}

function randomHeaderBackground() {
	var backgroundImage = 'url("'+rootPath+'/images/bg'+Math.floor(Math.random() * 58 + 1)+'.png")';
	//var backgroundImage = 'url("'+rootPath+'/images/bg52_fix.png")';
	$('.content-header').css('background-image', backgroundImage);
	$('.main-footer').css('background-image', backgroundImage);
	//http://localhost/images/bg52.png
}

function displayModal(type, slug, event, notification) {
	if (event) {
		//this is used in content table when row has event handler and contains buttons which have their own
		event.stopPropagation();
	}
	var modalElement = $('#modal-notification');
	var contentElement = modalElement.find('.modal-content');
	$.get(rootFolder+"templates/"+type+"-" + version + ".html", function(template) {
		var data = {};
		if (type == 'confirmation') {
			data.modalAction = "deleteSingleItem('"+slug+"');";
		} else if (type == 'notification') {
			try {
				data.notification = $.li18n.translate(notification);
			} catch(err) {
				data.notification = notification;
			}
		}
		var rendered = Mustache.render(template, data);
    	contentElement.html(rendered);
    	modalElement.modal('show');
	});
}

function slugifyText(text) {
	return text.toString().toLowerCase().trim()
	.replace(/\s+/g, '-')           // Replace spaces with -
	.replace(/&/g, '-and-')         // Replace & with 'and'
	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	.replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function displayFooterLinks(footerLinks) {
	if (footerLinks) {
		var contentElement = $(".main-footer>.row");
		contentElement.html(spinner);
		var deferreds = [];
		var footerLinksResolved = [];
		$.each(footerLinks, function(i, item) {
			footerLinksResolved.push({"previous": {}, "description": item.description, "next": {}});
			//making array of calls and rendering html when all are done
			//done is not called if getJSON receives null. always gets called as soon as any deferred receives null.
			//we make sure that done is produced in each deferred by calling it on always.
			var defferedPrevious = $.Deferred();
			var ajaxPrevious = $.getJSON(rootPath + restRoot + "/next", { "type": item.previous.type, "id": item.previous.id, "orderBy": item.previous.orderBy, "fixBy": item.previous.fixBy, "ascending": item.previous.ascending}, function( data ) {
				if (data) {
					footerLinksResolved[i].previous = data;
				}
			});
			ajaxPrevious.always(defferedPrevious.resolve);
			deferreds.push(defferedPrevious);

			var defferedNext = $.Deferred();
			var ajaxNext = $.getJSON(rootPath + restRoot + "/next", { "type": item.next.type, "id": item.next.id, "orderBy": item.next.orderBy, "fixBy": item.next.fixBy, "ascending": item.next.ascending}, function( data ) {
				if (data) {
					footerLinksResolved[i].next = data;
				}
			});
			ajaxNext.always(defferedNext.resolve);
			deferreds.push(defferedNext);
		});
		$.get(rootFolder+"templates/next" + "-" + version + ".html", function(template) {
			$.when.apply(null, deferreds).done(function() {
				var rendered = Mustache.render(template, {"items": footerLinksResolved, "trimLong": trimLong});
	    		contentElement.html(rendered);
			});
        });
	}
}