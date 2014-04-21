/**
 * [CasParseResponse class]
 */
function CasParseResponse(response) {
	// list formulas
	this.formulas = null;
	// list graphs
	this.graphs = {'1d': {}, '2d': {}, '3d': {}};
	// response from request
	this.response = response;
	// type graphs or formulas
	this.type = this.__checkType(this.response.result);
}

/**
 * [CasParseResponse prototype]
 * @type {Object}
 */
CasParseResponse.prototype = {
	// constructor
	constructor: CasParseResponse,
	// json template for graph
	graphJsonTemplate: {	title: {
				                text: false
				            },
				            subtitle: {
				                text: false
				            },
							chart: {
				                zoomType: 'x' 
				            },
				            tooltip: {},
				            xAxis: {
				            	title: false
				            },
				            yAxis: {
				                title: false
				            },
				            legend: false,
				            series: [{data: []}],
				            plotOptions: {
					            series: {
					                //pointStart: 0,
					                pointInterval: 1
					            }
					        },
				        },

	/**
	 * [getType description]
	 * @return {[type]} [description]
	 */
	getType: function() {
		return this.type;
	},

	/**
	 * [getGraphs description]
	 * @return {[type]} [description]
	 */
	getGraphs: function () {
		return this.graphs;
	},

	/**
	 * [__checkType private method check response type]
	 * @param  {Object} result [object result consist of three attributes formulas, graphs, results]
	 * @return {String}        [return formulas/graphs/null]
	 */
	__checkType: function (result) {
		if (result.formulas !== undefined && result.formulas !== null) {
			this.__parseGraphs(result.formulas);
			return "formulas";
		}
		else if (result.graphs !== undefined && result.graphs !== null) {
			this.__parseGraphs(result.graphs);
			return "graphs";
		}
		else {
			return null;
		}
	},

	/**
	 * [__parseFormulas private method description]
	 * @param  {[type]} formulas [description]
	 * @return {[type]}          [description]
	 */
	__parseFormulas: function(formulas) {

	},

	/**
	 * [__parseGraphs private method description]
	 * @param  {[type]} formulas [description]
	 * @return {[type]}          [description]
	 */
	__parseGraphs: function(graphs) {
		var i = 0;
		var j = 0;

		if (graphs.length > 0) {
			for (i = 0; i < graphs.length; i++) {
				// check first array element because of type of graph 1d || 2d || 3d
				switch (graphs[i][0].length) {
					// set axis x
					case 1:
						if (this.graphs['1d'].length === undefined)
							j = 0;
						else
							j = this.graphs['1d'].length;

						this.graphs['1d'][j] = this.graphJsonTemplate; //graphs;
						break;
					// set axises x, y
					case 2:
						if (this.graphs['1d'].length === undefined)
							j = 0;
						else
							j = this.graphs['1d'].length;

						// add data for axies x and y
						this.graphJsonTemplate.series[0].data = graphs[i];
						// add graph json template in graphs variable
						this.graphs['2d'][j] = this.graphJsonTemplate; //graphs;
						break;
					// set axises x, y, z
					case 3:
						if (this.graphs['1d'].length === undefined)
							j = 0;
						else
							j = this.graphs['1d'].length;

						this.graphs['3d'][j] = this.graphJsonTemplate; //graphs;
						break;
				}
			};
		}
	}
}
