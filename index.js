/*jshint asi:true, laxcomma:true, supernew:true, unused:true, loopfunc:true*/
;(function (global, Promise, undefined) { 'use strict'

Promise.prototype['catch'] = function (onRejected) {
    return this.then(undefined, onRejected)
}
var innerPromise = {
    resolve: function (value) {
        if (value instanceof Promise)
            return value
        return new this(function (res) {
            res(value)
        })
    }
    , reject: function (reason) {
        return new this(function (res, rej) {
            rej(reason)
        })
    }
    , all: function (array) {
        return new this(function (resolve, reject) {
            if (!isArray(array))
                reject(new TypeError)
            var pendingCount = array.length,
                results = []
            if (!pendingCount)
                return void resolve(results)
            for (var i = 0, len = array.length; i < len; i++) {
                (function (i) {
                    innerPromise.resolve(array[i]).then(function (result) {
                        results[i] = result
                        if (!--pendingCount)
                            resolve(results)
                    }, function (reason) {
                        reject(reason)
                    })
                })(i)
            }
        })
    }
    , race: function (array) {
        return new this(function (resolve, reject) {
            if (!isArray(array))
                reject(new TypeError)
            for (var i = 0, len = array.length; i < len; i++) {
                innerPromise.resolve(array[i]).then(function (result) {
                    resolve(result)
                }, function (reason) {
                    reject(reason)
                })
            }
        })
    }
}

var methods = ['resolve', 'reject', 'all', 'race']
for (var i = 0, len = methods.length; i < len; i++) {
    (function (name) {
        Promise[name] = function (x) {
            if (typeof this !== 'function') {
                throw new TypeError
            } else {
                new this(function (res, rej) {
                    if (typeof res !== 'function' || typeof rej !== 'function')
                        throw new TypeError
                })
                return innerPromise[name].call(this, x)
            }
        }
    })(methods[i])
}

function isArray (x) {
    return ({}).toString.call(x) === '[object Array]'
}

if (typeof module == 'object')
    module.exports = Promise
else if (!global.Promise)
    global.Promise = Promise

})(
this,
/**
 * ES6 style Promise constructor and Promises/A+ Promise#then method
 */
(function (global, undefined) { 'use strict'

function Promise (executor) {
    if (!(this instanceof Promise) || this._handler)
        throw new TypeError('Promise shall be called as a constructor')
    if (typeof executor !== 'function')
        throw new TypeError('Promise resolver ' + executor + ' is not a function')

    // The state and downstreams are stored in `._handler`
    var handler = this._handler = new Handler
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
    this._handler.then( // Spec #2.2.7
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
        if (this.state === 2) {
            next(callback, this.result)
        } else if (this.state === 3) {
            next(errback, this.reason)
        } else {
            this.callbacks.push(callback)
            this.errbacks.push(errback)
        }
    }
    , resolve: function (x) {
        if (this.state > 1)
            return
        var then
        try {
            then = getThen(x)
        } catch (e) {
            this.reject(e)
            return
        }
        if (then) {
            this.follow(then)
            return
        }
        this.state = 2
        this.result = x
        next(this.callbacks, x)
    }
    , reject: function (x) {
        if (this.state > 1)
            return
        this.state = 3
        this.reason = x
        next(this.errbacks, x)
    }
    , follow: function (then) {
        this.state = 1
        var self = this,
            canUnlock = true
        // A foreign `then` can be evil, be careful
        try {
            then(function (x) {
                if (canUnlock)
                    self.resolve(x)
                canUnlock = false
            }, function (x) {
                if (canUnlock)
                    self.reject(x)
                canUnlock = false
            })
        } catch (e) {
            if (canUnlock)
                self.reject(e)
            canUnlock = false
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
    for (var i = 0, len = queue.length; i < len; i++) {
        (function (fn) {
            setTimeout(function () {
                fn.call(undefined, value)
            }, 0)
        })(queue[i])
    }
    queue.length = 0
}

function isFunc (f) {
    return typeof f === 'function'
}

function getThen (obj) {
    if (!obj || typeof obj !== 'object' && !isFunc(obj))
        return false
    var then = obj.then
    return isFunc(then) && function (onFulfilled, onRejected) {
        then.call(obj, onFulfilled, onRejected)
    }
}

return Promise

})(this)

);
