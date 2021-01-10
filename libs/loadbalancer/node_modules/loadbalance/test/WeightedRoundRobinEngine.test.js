const { expect } = require('chai')
const WeightedRoundRobinEngine = require('../lib/WeightedRoundRobinEngine')

describe('WeightedRoundRobinEngine', function() {
	this.timeout(50000)

	const pool = ['a', 'b', 'c', 'd']

	const TEST_SIZE = 1000

	it(`picks ${TEST_SIZE} members from the pool using a weighted round robin`, function() {
		const poolWithWeights = []

		pool.forEach(function (v, i) {
			poolWithWeights.push({
				object: v,
				weight: i + 1
			})
		})

		const expected = ['d','d','d','d','c','c','c','b','b','a']

		const engine = new WeightedRoundRobinEngine(poolWithWeights)

		for (let i = 0, x = 0; i < TEST_SIZE; i++, x++) {
			if (x === expected.length) x = 0

			const pick = engine.pick()
			const mod = i % pool.length

			expect(pool).to.include(pick)
			expect(pick).to.equal(expected[x])
		}
	})

	it('entries must contain an "object" property', function () {
		const poolWithWeights = [{
			weight: 1
		}]

		expect(function () {
			const engine = new WeightedRoundRobinEngine(poolWithWeights)	
		}).to.throw('Please specify an object or a value (alias for object) property for entry in index 0')
	})

	it('entries "value" property is an alias to object property', function () {
		const poolWithWeights = [{
			weight: 1,
			value: 'a'
		}]

		expect(function () {
			const engine = new WeightedRoundRobinEngine(poolWithWeights)	
		}).not.to.throw()
	})

	it('weights must be integers', function () {
		const poolWithWeights = [{
			weight: 0.2,
			object: 'a'
		}]

		expect(function () {
			const engine = new WeightedRoundRobinEngine(poolWithWeights)	
		}).to.throw('Weight in index 0 must be an integer')
	})

	it('weights must greater than zero', function () {
		const poolWithWeights = [{
			weight: 0,
			object: 'a'
		}]

		expect(function () {
			const engine = new WeightedRoundRobinEngine(poolWithWeights)	
		}).to.throw('Weight in index 0 must be greater than zero')
	})
})
