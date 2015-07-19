'use strict'

var Promise = require('../')
    , promisesAplusTests = require('promises-aplus-tests')
    , promisesES6Tests = require("promises-es6-tests")
    , promiseAdapter = require('./adapter')

GLOBAL.assert = require('assert')

promisesES6Tests(promiseAdapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    if (err)
        return

    promisesAplusTests(promiseAdapter, function (err) {
        // tests complete; output to console; `err` is number of failures
    });
});

