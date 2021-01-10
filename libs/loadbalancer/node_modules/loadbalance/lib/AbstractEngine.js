const debug = require('./debug')('AbstractEngine')

class AbstractEngine {
	constructor (pool) {
		this._pool = pool
		debug('ctor')
	}

	/**
	 * pick a single member from the pool using the load balancing implementation
	 *
	 */
	pick() {
		throw new Error('abstract engine')
	}
}

module.exports = AbstractEngine