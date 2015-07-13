/*jshint asi:true, laxcomma:true, supernew:true*/
;(function (global) { 'use strict'

function Promise (executor) {
    if (!(this instanceof Promise))
        throw new TypeError('Promise is intended to be called as a constructor')
    if (typeof executor !== 'function')
        throw new TypeError('Promise resolver ' + executor + ' is not a function')

    var self = this

    // The state and downstreams are stored in `._handler`
    var handler = self._handler = new Handler
    try {
        executor(function (x) {
            handler.resolve(x)
        }, function (x) {
            handler.reject(x)
        })
    } catch (e) {
        handler.reject(e)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    var resolve, reject
    var promise = new Promise(function (res, rej) {
        resolve = res
        reject = rej
    })
    this._handler.then(
        isFunc(onFulfilled) ? wrapCallback(promise, resolve, reject, onFulfilled) : resolve,
        isFunc(onRejected) ? wrapCallback(promise, resolve, reject, onRejected) : reject
    )
    return promise
}

function Handler () {
    /*
     * 0: un-resolved
     * 1: locked in to another promise
     * 2: fulfilled
     * 3: rejected
     * {0, 1}: pending
     * {1, 2, 3}: resolved
     * {2, 3}: settled
     */
    this.state = 0
    this.callbacks = []
    this.errbacks = []
    this.result = void 0
    this.reason = void 0
}
Handler.prototype = {
    constructor: Handler
    , then: function (callback, errback) {
        this.callbacks.push(callback)
        this.errbacks.push(errback)
        if (this.state === 2)
            next(callback, this.result)
        if (this.state === 3)
            next(errback, this.reason)
    }
    , resolve: function (x, unlock) {
        if (this.state > 1 && unlock !== 1)
            return
        var then
        try {
            then = getThen(x)
        } catch (e) {
            this.reject(e)
            return
        }
        if (then) {
            this.follow(x, then)
            return
        }
        this.state = 2
        this.result = x
        next(this.callbacks, x)
    }
    , reject: function (x, unlock) {
        if (this.state > 1 && unlock !== 1)
            return
        var then
        try {
            then = getThen(x)
        } catch (e) {
            this.reject(e)
            return
        }
        if (then) {
            this.follow(x, then)
            return
        }
        this.state = 3
        this.reason = x
        next(this.errbacks, x)
    }
    , follow: function (x, then) {
        var self = this
        self.state = 1
        var unlock = 0
        try {
            then.call(x, function (x) {
                self.resolve(x, ++unlock)
            }, function (x) {
                self.reject(x, ++unlock)
            })
        } catch (e) {
            self.reject(e, ++unlock)
        }
    }
}

function wrapCallback (promise, resolve, reject, fn) {
    return function (x) {
        var result
        try {
            result = fn.call(undefined, x)
        } catch (e) {
            reject(e)
            return
        }
        if (result === promise) {
            reject(new TypeError('Cannot resolve a promise with itself'))
            return
        }
        resolve(result)
    }
}

function next (queue, value) {
    if (isFunc(queue))
        queue = [queue]
    queue.forEach(function (fn) {
        setTimeout(function () {
            fn.call(undefined, value)
        })
    })
}

function isFunc (f) {
    return typeof f === 'function'
}

function getThen (obj) {
    if (!obj || typeof obj !== 'object' && typeof obj !== 'function')
        return false
    var then = obj.then
    return isFunc(then) && then
}


if (typeof module !== 'undefined')
    module.exports = Promise
else
    global.Promise = Promise

})(this);
