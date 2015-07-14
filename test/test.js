'use strict'

var Promise = require('../')
    , assert = require('assert')
    , noop = function () {}
    , throwE = function () { throw new Error }

assert.throws(function () {
    Promise(noop)
}, TypeError)

assert.throws(function () {
    new Promise(5)
}, TypeError)

assert.doesNotThrow(function () {
    new Promise(throwE)
})
