const { expect } = require('chai')
const RoundRobinEngine = require('../lib/RoundRobinEngine')

describe('RoundRobinEngine', function () {
	this.timeout(50000)
	
	const pool = ['a', 'b', 'c', 'd']
	
	const TEST_SIZE = 100000

	it(`pick ${TEST_SIZE}  members from the pool using round robin`, function () {
		const engine = new RoundRobinEngine(pool)

		for (let i = 0; i < TEST_SIZE; i++) {
			const pick = engine.pick()
			
			const mod = i % pool.length

			expect(pool).to.include(pick)
			expect(pick).to.equal(pool[mod])
		}
	})
})