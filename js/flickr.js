'use strict';

/**
 * Flickr API
 */
var FLICKR_API = FLICKR_API || (function() {

	var self = {};
	var _API_KEY = '2e0c2c23cef8c98cf15957497ef6ab41';
	var _SECRET = 'da513b0f7b9f1894';
	var _METHOD = 'flickr.photos.search';

	/**
	 * search photos using REST request
	 * @searchText {String}
	 * @returns
	 */
	self.searchPhotos = function(searchText) {
		console.log(searchText);
		var req_url = 'https://api.flickr.com/services/rest/?method=' + _METHOD +
			'&api_key=' + _API_KEY +
			'&format=json&nojsoncallback=1&media=photos&content_type=1&safe_search=1&privacy_filter=1' +
			'&page=1&per_page=6&tags=coffee%2Cbeijing&tag_mode=all&text=' + searchText;
		var promise = $.ajax({
			url: req_url,
			method: 'GET'
		});
		return promise;
	};
	/**
	 * resolve json response and return an array of photo urls
	 * @data
	 * @returns {Array}
	 */
	self.getPhotoURLs = function(data) {
		var photoURLs = [];

		if (data.stat === 'ok') {
			$.each(data.photos.photo, function(index, photo) {
				var photoURL = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
				photoURLs.push(photoURL);
			});
		} else if (data.stat === 'fail') {
			swal({
				type: 'error',
				title: 'fail',
				text: data.code + ':' + data.message,
				allowOutsideClick: false
			});
		}

		return photoURLs;
	};

	return self;

}());