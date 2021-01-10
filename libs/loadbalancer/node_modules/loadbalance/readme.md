# loadbalance

[![npm status](http://img.shields.io/npm/v/loadbalance.svg?style=flat-square)](https://www.npmjs.org/package/loadbalance) [![Travis build status](https://img.shields.io/travis/kessler/node-loadbalance.svg?style=flat-square&label=travis)](http://travis-ci.org/kessler/node-loadbalance) [![Dependency status](https://img.shields.io/david/kessler/node-loadbalance.svg?style=flat-square)](https://david-dm.org/kessler/node-loadbalance)

This is a collection of load balancing engines in (what is hopefully) their most distilled form. 

The goal was to create a highly reusable implementation that imposes as little as possible on the user.

## Install

With [npm](https://npmjs.org) do:

`npm i loadbalance`

```js
const loadbalance = require('loadbalance')
```

## Usage
To use, instantiate an engine or call a factory method with a pool. Then call pick(), which will return the selected object, calling pick() repeatedly will yield the same or a different object from the pool, depending on the algorithm which powers that engine.

```javascript
const loadbalance = require('loadbalance')
const engine = loadbalance.random(['a', 'b', 'c'])
const pick = engine.pick()
```

### pick()
`pick()` is called without any arguments and will always return an object which is a member of the pool according to the pool's selection strategy

## Engines

### Random Engine
The random engine picks an object from the pool at random, each time pick() is called.

```javascript
const loadbalance = require('loadbalance')
const engine = loadbalance.random(['a', 'b', 'c'])
const pick = engine.pick()
```

#### new RandomEngine(pool, seed)
```javascript
const engine = new loadbalance.RandomEngine(pool)
```
Pool - an objects to pick from, eg ```[1,2,3]```
Seed - an optional seed that will be used to recreate a random sequence of selections

### Weighted Random Engine
The random engine picks an object from the pool at random **but with bias** (probably should have called it BiasedRandomEngine), each time pick() is called.

```javascript
const loadbalance = require('loadbalance')
const engine = loadbalance.random([
    { object: 'a', weight: 2 }, 
    { object: 'b', weight: 3 }, 
    { object: 'c', weight: 5 }
])
const pick = engine.pick()
```
With this engine, calling pick() repeatedly will roughly return `'a'` 20% of the time, `'b'` 30% of the time and `'c'` 50% of the time

#### new WeightedRandomEngine(pool, seed)
```javascript
const engine = new loadbalance.WeightedRandomEngine(pool)
```

Pool - objects to pick from. Each object is of the form:
```javascript
const object1 = {
    object: 'something',
    weight: 2
}
```

Seed - an optional seed that will be used to recreate a random sequence of selections

### RoundRobinEngine
An engine that picks objects from its pool using Round Robin algorithm (doh!)

```javascript
const loadbalance = require('loadbalance')
const engine = loadbalance.roundRobin(['a', 'b', 'c'])
const pick = engine.pick()
```

The roundRobin() factory method can be used to obtain both RoundRobinEngine and WeightedRoundRobinEngine. The decision is based on the contents of the pool.

#### new RoundRobinEngine(pool) 
```javascript
const engine = new loadbalance.RoundRobinEngine(pool)
```
Pool - objects to pick from, eg ```[1,2,3]```

### WeightedRoundRobinEngine
Same as round robin engine, only members of the pool can have weights. 

```javascript
const loadbalance = require('loadbalance')
const engine = loadbalance.roundRobin([{ object: 'a', weight: 2 }, {object: 'b', weight: 1 }])
const pick = engine.pick()
```

call pick six times using the above engine will yield: 'a', 'a', 'b', 'a', 'a', 'b'

#### new WeightedRoundRobinEngine(pool) 
```javascript
const engine = new loadbalance.WeightedRoundRobinEngine(pool)
```
Pool - objects to pick from. Each object is of the form:
```javascript
const object1 = {
    object: 'something',
    weight: 2
}
```

Weight should always be an integer which is greater than zero. 
Object (you can also use value, its an alias property) can be anything you want, just like other pools. It cannot, however, be null or undefined at the time the pool is created.

### PriorityEngine
Not yet implemented

### Extensibility
Here is an example of a custom engine:
```javascript
const AbstractEngine = require('loadbalance').AbstractEngine

class MyEngine{
    constructor(pool) {
        super(pool)
    }

    pick() {
        // pick something from the pool somehow and return it
    }
}

```
The contract of pick() states that it MUST return something each invocation.

## misc

This module shares some functinality with [pool](https://github.com/coopernurse/node-pool) module. It is worth taking a look at it if you are looking for something more high level.

This module is heavily inspired by this [article about load balance algorithms](https://devcentral.f5.com/articles/intro-to-load-balancing-for-developers-ndash-the-algorithms)


## license

[MIT](http://opensource.org/licenses/MIT) © [yaniv kessler](blog.yanivkessler.com)
