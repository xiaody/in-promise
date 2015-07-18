'use strict'

var Promise = require('../')
    , promisesAplusTests = require('promises-aplus-tests')
    , promisesES6Tests = require("promises-es6-tests")
    , promiseAdapter = require('./adapter')


promisesAplusTests(promiseAdapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    if (err)
        return

    promisesES6Tests(promiseAdapter, function (err) {
        // tests complete; output to console; `err` is number of failures
    });
});

