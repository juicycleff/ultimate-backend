const AbstractEngine = module.exports.AbstractEngine = require('./lib/AbstractEngine.js')
const RandomEngine = module.exports.RandomEngine = require('./lib/RandomEngine.js')
const WeightedRandomEngine = module.exports.WeightedRandomEngine = require('./lib/WeightedRandomEngine.js')
const RoundRobinEngine = module.exports.RoundRobinEngine = require('./lib/RoundRobinEngine.js')
const WeightedRoundRobinEngine = module.exports.WeightedRoundRobinEngine = require('./lib/WeightedRoundRobinEngine.js')

module.exports.roundRobin = (pool) => {
	if (pool.length === 0) {
		throw new Error('pool length must be greater than zero')
	}

	const entry = pool[0]

	if (entry.weight) {
		return new WeightedRoundRobinEngine(pool)
	} else {
		return new RoundRobinEngine(pool)
	}
}

module.exports.random = (pool, seed) => {
	if (pool.length === 0) {
		throw new Error('pool length must be greater than zero')
	}

	const entry = pool[0]

	if (entry.weight) {
		return new WeightedRandomEngine(pool, seed)
	} else {
		return new RandomEngine(pool, seed)
	}
}

module.exports.isEngine = (engine) => {
	return engine instanceof AbstractEngine
}
