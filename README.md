<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
        title="Promises/A+ 1.1 compliant" align="right" />
</a>
[![Build Status](https://travis-ci.org/xiaody/in-promise.svg?branch=master)](https://travis-ci.org/xiaody/in-promise)
[![codecov.io](http://codecov.io/github/xiaody/in-promise/coverage.svg?branch=master)](http://codecov.io/github/xiaody/in-promise?branch=master)
[![Dependency Status](https://david-dm.org/xiaody/in-promise.svg)](https://david-dm.org/xiaody/in-promise)
[![devDependency Status](https://david-dm.org/xiaody/in-promise/dev-status.svg)](https://david-dm.org/xiaody/in-promise#info=devDependencies)

in-promise is a minimal Promises/A+ implementation for browsers.
Less than 700 bytes (gzip).


# API
It is really _minimal_, and only provides a `Promise#then` method:

```js
var p1 = new Promise(function (res, rej) {
  setTimeout(function () {
    res('Hello Promise')
  }, 100)
})
var p2 = p1.then(function (value) {
  console.log(value) // Hello Promise
})
```

This is no `Promise#catch` or `Promise.all` or `Promise.race` or ...
Just `Promise#then`.
