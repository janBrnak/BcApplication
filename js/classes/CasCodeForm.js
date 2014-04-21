const CAS_SERVER_URL = "http://147.175.125.30:8003/~pobiecky/cas_api.php";
const FORM_DATA_PREFIX = "cas_";
const FORM_DATA_FIELDS = [FORM_DATA_PREFIX + "code", FORM_DATA_PREFIX + "engine", FORM_DATA_PREFIX + "formula_output", FORM_DATA_PREFIX + "graph_output"];

/**
 * [CodeForm class]
 */
function CasCodeForm(data) {
	this.data = data;
	this.response = null;
}

/**
 * [CodeForm prototype]
 * @type {Object}
 */
CasCodeForm.prototype = {
	// constructor
	constructor: CasCodeForm,
	// server url
	CAS_SERVER_URL: CAS_SERVER_URL,
	// form inputs
	FORM_DATA_FIELDS: FORM_DATA_FIELDS,

	/**
	 * [parseObject created new object with forms data]
	 * @return {Object} [object with forms data name => value]
	 */
	parseObject: function () {
		var result = {};
		var i = 0;

		for (i in this.data) {
			with (this.data[i]) {
				if (this.__inArray(name, this.FORM_DATA_FIELDS)) {
					result[name.replace(FORM_DATA_PREFIX, "")] = value;
				}
			}
		}

		return result;
	},

	xhrRequest: function (request) {
		var xhr = new XMLHttpRequest();
	},

	/**
	 * [__inArray private method check value, if is in array]
	 * @param  {String} value [value]
	 * @param  {Array} array [array]
	 * @return {Boolean} [return true, if value is in array]
	 */
	__inArray: function(value, array) {
		var i = 0;

		for (i in array) {
			if (value === array[i]) {
				return true;
			}
		}

		return false;
	}
}
