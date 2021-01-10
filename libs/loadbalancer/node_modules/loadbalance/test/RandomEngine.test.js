const { expect } = require('chai')
const RandomEngine = require('../lib/RandomEngine')

describe('RandomEngine', function () {
	this.timeout(50000)
	
	const pool = ['a', 'b', 'c', 'd']
	const TEST_SIZE = 100000

	it(`pick ${TEST_SIZE} random elements from a pool`, function () {
		const engine = new RandomEngine(pool)

		const results = {}

		for (let i = 0; i < pool.length; i++) {
			results[pool[i]] = 0
		}

		for (let i = 0; i < TEST_SIZE; i++) {
			let pick = engine.pick()
			expect(pool).to.include(pick)
			results[pick]++
		}

		for (let r in results) {
			let p = results[r] / TEST_SIZE
			expect(p).to.be.above(0.24)
			expect(p).to.be.below(0.26)
		}
	})

	it('accepts a seed number to be used for repeating random pick series', function () {
		const e1a = new RandomEngine(pool, 1)
		const e1b = new RandomEngine(pool, 1)

		const e2 = new RandomEngine(pool, 2)

		for (let i = 0; i < TEST_SIZE; i++) {
			const e1aPick = e1a.pick()
			const e1bPick = e1b.pick()
			const e2Pick = e2.pick()

			expect(e1aPick).to.equal(e1bPick)
		}
	})

	it('benchmark', function () {

	})
})