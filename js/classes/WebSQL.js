/**
 * Global variables
 */
const MESSAGE_CALLBACK = {error: null, message: null, attributes: null};

/**
 * [WebSQL class]
 * @param {String}  dbName         name of database
 * @param {String}  dbVersion      version of database
 * @param {String}  dbDescription  description of database
 * @param {Integer} dbSize         size of database
 */
function WebSQL(dbName, dbVersion, dbDescription, dbSize) {
	this.dbName = dbName;					// name of database
	this.dbVersion = dbVersion;				// version of database
	this.dbDescription = dbDescription;		// description of database
	this.dbSize = dbSize;					// size of database

	this.db = window.openDatabase(this.dbName, this.dbVersion, this.dbDescription, this.dbSize);
}

/**
 * [WebSQL prototype]
 * @type {Object}
 */
WebSQL.prototype = {
	// constructor
	constructor: WebSQL,

	/**
	 * Execution of transaction
	 * @param  {Function} executeSQL executeSql function
	 */
	runTransaction: function(executeSQL) {
		this.db.transaction(executeSQL);
	},

	/**
	 * Succes callback method for executeSql
	 * @param  {Object} transaction transaction object
	 * @param  {Object} result      result object
	 * @return {Object}             success message
	 */
	successCallback: function(transaction, result) {
		MESSAGE_CALLBACK.error = 0;
		MESSAGE_CALLBACK.message = "SUCCESS: transaction of executed";
		MESSAGE_CALLBACK.attributes = result.rows;

		console.log(MESSAGE_CALLBACK);
	},

	/**
	 * Error callback method for executeSql
	 * @param  {Object} transaction transaction object
	 * @param  {Object} error      	error object
	 * @return {Object}             success message
	 */
	errorCallback: function(transaction, error) {
		MESSAGE_CALLBACK.error = error.code;
		MESSAGE_CALLBACK.message = "ERROR: " + error.message;
		MESSAGE_CALLBACK.attributes = null;

		console.log(MESSAGE_CALLBACK);
	}
}