var recentItemsDefinition = {};

$(document).ready(function() {
	$('body').on('click', '.recent .load_more', function(e) {
		console.log("gombo: " + recentItemsDefinition.texts.end);
		var itemType = $(this).closest(".col-sm-4").attr('class').split(' ')[1];
		$(".recent ." + itemType + " .load_more .overlay").html(spinner);
		loadRecentItems(itemType);
	});
});

function displayRecent() {
	$.get(rootPath + "/templates/recent" + "-" + version + ".html", function(template) {
		var isLoggedIn = username != "gost";
		var rendered = Mustache.render(template, {"isLoggedIn": isLoggedIn});
		$(".recent").html(rendered);
		$(".recent .overlay").html(spinner);

		recentItemsDefinition.texts = {"start": 0, "end": 4, "orderBy": "date,desc", "filterBy": "distinct, "};
		recentItemsDefinition.comments = {"start": 0, "end": 4, "orderBy": "ancestorActivity,desc", "filterBy": "ancestorActivity, "};
		recentItemsDefinition.topics = {"start": 0, "end": 4, "orderBy": "activity,desc", "filterBy": ""};
		recentItemsDefinition.announcements = {"start": 0, "end": 4, "orderBy": "date,desc", "filterBy": ""};
		recentItemsDefinition.contests = {"start": 0, "end": 4, "orderBy": "date,desc", "filterBy": ""};
		recentItemsDefinition.connections = {"start": 0, "end": 4, "orderBy": "date,desc", "filterBy": ""};

		loadRecentItems("texts");
		loadRecentItems("comments");
		loadRecentItems("topics");
		loadRecentItems("announcements");
		loadRecentItems("contests");
		loadRecentItems("connections");
	});
}

function loadRecentItems(type) {
	$.get(rootPath + "/templates/recent_" + type + "-" + version + ".html", function(templateRecentItems) {
		$.getJSON(rootPath + restRoot + "/" + type, recentItemsDefinition[type], function(dataRecentItems) {
			var renderedRecentItems = Mustache.render(templateRecentItems, { "items": dataRecentItems, "timestampDate": timestampDate, "trimLong": trimLong, "slugify": slugify});
			var placeholderElement;
			if (recentItemsDefinition[type].start == 0) {
				placeholderElement = $(".recent ." + type + " .first_five");
			} else {
				placeholderElement = $(".recent ." + type + " .load_more");
			}
			placeholderElement.replaceWith(renderedRecentItems);
			recentItemsDefinition[type].start += dataRecentItems.length;
			recentItemsDefinition[type].end += dataRecentItems.length;
		});
	});
}