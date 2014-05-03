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
	},

	/**
	 * [getCode get code]
	 * @return {String} code
	 */
	getCode: function() {
		return this.params.code;
	},

	/**
	 * [getEngine get engine]
	 * @return {String} engine
	 */
	getEngine: function() {
		return this.params.engine;
	},

	/**
	 * [getGraphOutput get graph output]
	 * @return {String} graph output
	 */
	getGraphOutput: function() {
		return this.params.graph_output;
	},

	/**
	 * [getFormulaOutput get formula output]
	 * @return {String} formula output
	 */
	getFormulaOutput: function() {
		return this.params.formula_output;
	}
}
