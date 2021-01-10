const { expect } = require('chai')
const index = require('../index')
const WeightedRoundRobinEngine = require('../lib/WeightedRoundRobinEngine')
const RoundRobinEngine = require('../lib/RoundRobinEngine')

describe('exports', function() {
	describe('a factory method that creates a round robin or weighted round robin engine, based on the contents of the pool.', function() {
		it('If the first entry in the pool contain a weight property a weighted round robin engine will be returned', function() {
			var engine = index.roundRobin([{
				object: 'a',
				weight: 1
			}])

			expect(engine).to.be.an.instanceOf(WeightedRoundRobinEngine)
		})

		it('If the first entry in the pool DOES NOT contain a weight property a norma round robin engine will be returned', function() {
			var engine = index.roundRobin(['a'])

			expect(engine).to.be.an.instanceOf(RoundRobinEngine)
		})
	})

	describe('an isEngine method to identify instances of engines', function() {
		it('for example RoundRobinEngine will be true', function() {
			var engine = new RoundRobinEngine([1, 2, 3])

			expect(index.isEngine(engine)).to.be.true
		})

		it('while another object that does not inherit from AbstractEngine is false', function() {
			var engine = {}

			expect(index.isEngine(engine)).to.be.false
		})
	})
})