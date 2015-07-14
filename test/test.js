'use strict'

var Promise = require('../')
    , assert = require('assert')
    , noop = function () {}
    , throwE = function () { throw new Error }
    , promisesAplusTests = require('promises-aplus-tests')
    , promiseAplusAdapter = require('./aplus')

assert.throws(function () {
    Promise(noop)
}, TypeError)

assert.throws(function () {
    new Promise(5)
}, TypeError)

assert.doesNotThrow(function () {
    new Promise(throwE)
})

promisesAplusTests(promiseAplusAdapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
