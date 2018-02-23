'use strict';

/**
 *
 */
var INSTAGRAM_API = INSTAGRAM_API || (function() {
	var self = {};
	var _REDIRECT_URI = 'https://3fun4.github.io/beijing-coffee-shops/';
	var _CLIENT_ID = '2070bdc56e97437b871733b8943d0a12';
	var _CLIENT_SECRET = '38ffd2b1edae4bc8a4285d02f7a6cff4';
	var _ACCESS_TOKEN = '32952362.2070bdc.e9513af9956249a883f9c01a400e7ae1';
	var _CODE2 = '8e4f88b195e24a2ebef0af337631ce4d';
	var _CODE = '7aab0f3beb944f18a8da1998e449eeee';

	self.test = function(tagName) {
		//TODO: //get access_token
		var req_code_url = 'https://api.instagram.com/oauth/authorize/?client_id=' + _CLIENT_ID +
			'&redirect_uri=' + _REDIRECT_URI +
			'&response_type=code';
		console.log(req_code_url);

		var req_token_url = 'https://api.instagram.com/oauth/access_token/?client_id=' + _CLIENT_ID +
			'&client_secret=' + _CLIENT_SECRET +
			'&grant_type=authorization_code' +
			'&redirect_uri=' + _REDIRECT_URI +
			'&code=' + _CODE;
		console.log(req_token_url);

		var request = $.ajax({
			url: req_code_url,
			dataType: 'json',
			method: 'POST'

		}).done(function(data, textStatus, jqXHR) {

			console.log(data);


		}).fail(function() {});
	}

	return self;

}());