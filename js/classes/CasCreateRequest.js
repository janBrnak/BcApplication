/**
 * [CasCreateRquest class]
 */
function CasCreateRquest(params) {
	this.params = params;
}

/**
 * [CasCreateRquest prototype]
 * @type {Object}
 */
CasCreateRquest.prototype = {
	// constructor
	constructor: CasCreateRquest,
	// request structure
	request: {
		id: 1,
		method: "eval",
		params: new Object
	},

	/**
	 * [getRequest creating JSON object and return it]
	 * @return {json} [json request]
	 */
	getRequest: function(format) {
		this.request.params = this.params;

		switch (format) {
			// json format
			case 'json':
				return this.request;
				break;
		}
		
		return null;
	}
}
