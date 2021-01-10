const RoundRobinEngine = require('./RoundRobinEngine')
const prepareWeights = require('./prepareWeights')
const debug = require('./debug')('WeightedRoundRobinEngine')

class WeightedRoundRobinEngine extends RoundRobinEngine {
	constructor(pool) {
		super(prepareWeights(pool))
		debug('ctor')
	}
}

module.exports = WeightedRoundRobinEngine