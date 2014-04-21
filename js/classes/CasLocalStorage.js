/**
 * Global variables
 */
const LOCAL_STORAGE_STRUCT = {version: '1.0.0', user_id: null, first_open: null};

/**
 * [CasLocalStorage description]
 */
function CasLocalStorage(item) {
	this.storage = localStorage;
	this.item = item;

	if (this.getItem() === null)
		this.setItem(this.objectToString(LOCAL_STORAGE_STRUCT));
}

/**
 * [LocalStorage prototype]
 * @type {Object}
 */
CasLocalStorage.prototype = {
	// constructor
	constructor: CasLocalStorage,

	/**
	 * [setVersion description]
	 */
	setVersion: function(value) {
		var object = this.getItem();

		object.version = value;
		this.setItem(this.objectToString(object));
	},

	/**
	 * [setUserId description]
	 */
	setUserId: function(value) {
		var object = this.getItem();

		object.user_id = value;
		this.setItem(this.objectToString(object));
	},

	/**
	 * [setFirstOpen description]
	 */
	setFirstOpen: function(value) {
		var object = this.getItem();

		object.first_open = value;
		this.setItem(this.objectToString(object));
	},

	/**
	 * [setItem description]
	 * @param {String} item  [description]
	 * @param {String} value [description]
	 */
	setItem: function(value) {
		this.storage.setItem(this.item, value);
	},

	/**
	 * [getVersion description]
	 * @return {String} version
	 */
	getVersion: function() {
		return this.getItem().version;
	},

	/**
	 * [getUserId description]
	 * @return {String} user id
	 */
	getUserId: function() {
		return this.getItem().user_id;
	},

	/**
	 * [getFirstOpen description]
	 * @return {String} first open
	 */
	getFirstOpen: function() {
		return this.getItem().first_open;
	},

	/**
	 * [getItem description]
	 * @param  {String} item [description]
	 * @return {Object}      [description]
	 */
	getItem: function() {
		return this.stringToObject(this.storage.getItem(this.item));
	},

	/**
	 * [objectToString description]
	 * @param  {Object} object [description]
	 * @return {String}        [description]
	 */
	objectToString: function(object) {
		return JSON.stringify(object);
	},

	/**
	 * [stringToObject description]
	 * @param  {String} value  [description]
	 * @return {Object}        [description]
	 */
	stringToObject: function(value) {
		return JSON.parse(value);
	},

	/**
	 * [isUserLogged check if user is logged]
	 * @return {Boolean} return true if user is logged
	 */
	isUserLogged: function () {
		if (this.getUserId() === null)
			return false;
		else
			return true;
	},

	/**
	 * [isAppFirstOpened Check if aplication is first time opened]
	 * @return {Boolean} return true if aplication is first time opened
	 */
	isAppFirstOpened: function () {
		if (this.getFirstOpen() === null)
			return true;
		else
			return false;
	}
}