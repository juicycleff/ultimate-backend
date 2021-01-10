const RandomEngine = require('./RandomEngine')
const prepareWeights = require('./prepareWeights')
const debug = require('./debug')('WeightedRandomEngine')

class WeightedRandomEngine extends RandomEngine {
	
	/**
	 *	@param {Array} pool - objects to pick from
	 *	@param {int}	seed - an optional seed that will be used to recreate a random sequence of selections
	 */
	constructor(pool, seed) {
		super(prepareWeights(pool), seed)
		debug('ctor')
	}
}

module.exports = WeightedRandomEngine