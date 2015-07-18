'use strict'

var Promise = require('../')

module.exports = {
    deferred: function () {
        var resolve, reject
        var promise = new Promise(function (res, rej) {
            resolve = res
            reject = rej
        })
        return {
            promise: promise
            , resolve: resolve
            , reject: reject
        }
    },
    defineGlobalPromise: function (scope) {
        scope.Promise = Promise
    },
    removeGlobalPromise: function (scope) {
        delete scope.Promise
    }
}
