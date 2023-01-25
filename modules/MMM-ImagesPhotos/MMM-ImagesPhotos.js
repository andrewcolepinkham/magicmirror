/* global Module */

/* Magic Mirror
 * Module: MMM-ImagesPhotos
 *
 * By Rodrigo Ramírez Norambuena https://rodrigoramirez.com
 * MIT Licensed.
 */

Module.register("MMM-ImagesPhotos",{
	defaults: {
		opacity: 0.9,
		animationSpeed: 500,
		updateInterval: 5000,
		getInterval: 60000,
		maxWidth: "100%",
		maxHeight: "100%",
		retryDelay: 2500
	},
	

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		this.photos = [];
		this.loaded = false;
		this.lastPhotoIndex = -1;
		const d = new Date();
		var startTime = '20:00:00';
		var endTime = '21:30:00';

		currentDate = new Date()   

		startDate = new Date(currentDate.getTime());
		startDate.setHours(startTime.split(":")[0]);
		startDate.setMinutes(startTime.split(":")[1]);
		startDate.setSeconds(startTime.split(":")[2]);

		endDate = new Date(currentDate.getTime());
		endDate.setHours(endTime.split(":")[0]);
		endDate.setMinutes(endTime.split(":")[1]);
		endDate.setSeconds(endTime.split(":")[2]);


		valid = startDate < currentDate && endDate > currentDate
		Log.error("TIME: ".concat(currentDate).concat(valid))
		// Schedule update timer.
		if (valid){
			this.getPhotos();
			setInterval(function() {
				self.updateDom(self.config.animationSpeed);
			}, this.config.updateInterval);
		}

	},

	/*
	 * getPhotos
	 * Requests new data from api url helper
	 *
	 */
	getPhotos: function() {
		var urlApHelper = "/MMM-ImagesPhotos/photos";
		var self = this;
		var retry = true;

		var photosRequest = new XMLHttpRequest();
		photosRequest.open("GET", urlApHelper, true);

		photosRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processPhotos(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load photos.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		photosRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.getInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getPhotos();
		}, nextLoad);
	},


	/* randomIndex(photos)
	 * Generate a random index for a list of photos.
	 *
	 * argument photos Array<String> - Array with photos.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(photos) {
		if (photos.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * photos.length);
		};

		var photoIndex = generate();
		this.lastPhotoIndex = photoIndex;

		return photoIndex;
	},

	/* complimentArray()
	 * Retrieve a random photos.
	 *
	 * return photo Object - A photo.
	 */
	randomPhoto: function() {
		var photos = this.photos;
		var index = this.randomIndex(photos);

		return photos[index];
	},


	getDom: function() {
		var self = this;
		var wrapper = document.createElement("div");
		var photoImage = this.randomPhoto();

		if (photoImage) {
			var img = document.createElement("img");
			img.src = photoImage.url;
			img.id = "mmm-images-photos";
			img.style.maxWidth = this.config.maxWidth;
			img.style.maxHeight = this.config.maxHeight;
			img.style.opacity = self.config.opacity;
			wrapper.appendChild(img);
		}
		return wrapper;
	},

	getScripts: function() {
		return ["MMM-ImagesPhotos.css"]
	},

	processPhotos: function(data) {
		var self = this;
		this.photos = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;
	},

});
