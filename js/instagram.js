'use strict';

/**
 *
 */
var INSTAGRAM_API = INSTAGRAM_API || (function() {
	var self = {};
	var _CLIENT_ID = '2070bdc56e97437b871733b8943d0a12';
	var _CLIENT_SECRET = '38ffd2b1edae4bc8a4285d02f7a6cff4';
	var _ACCESS_TOKEN = '32952362.2070bdc.e9513af9956249a883f9c01a400e7ae1';

	self.test = function(tagName) {
		//load Geo data from JSON file
		var request = $.ajax({
			url: 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent?access_token=' + _ACCESS_TOKEN,
			dataType: 'json',
			method: 'GET'

		}).done(function(data, textStatus, jqXHR) {

			console.log(data);


		}).fail(function() {});
	}

	return self;

}());