const AbstractEngine = require('./AbstractEngine')
const { Random, MersenneTwister19937 } = require( 'random-js')
const debug  = require('./debug')('RandomEngine')

class RandomEngine extends AbstractEngine {

	/**
	 *	@param {Array} pool - objects to pick from
	 *	@param {int}	seed - an optional seed that will be used to recreate a random sequence of selections
	 */
	constructor(pool, seed) {
		super(pool)
		debug('ctor')

		this._maxPick = pool.length - 1

		if (typeof(seed) === 'number') {
			debug('using Mersenne Twister engine with seed %d', seed)
			this._r = new Random(MersenneTwister19937.seed(seed))
		} else {
			debug('using Mersenne Twister engine with autoSeed')
			this._r = new Random(MersenneTwister19937.autoSeed())
		}
	}

	pick() {
		let index = this._lastPick = this._r.integer(0, this._maxPick)
		return this._pool[index]
	}
}

module.exports = RandomEngine