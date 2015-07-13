<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
        title="Promises/A+ 1.1 compliant" align="right" />
</a>
in-promise is a minimal Promises/A+ implementation for browsers.
Less than 700 bytes (gzip).


# API
It is really _minimal_, only provides a `Promise#then` method:

```js
var p1 = new Promise(function (res, rej) {
  setTimeout(function () {
    res('Hello Promise')
  }, 100)
}
var p2 = p1.then(function (value) {
  console.log(value) // Hello Promise
})
```

This is no `Promise#catch` or `Promise.all` or `Promise.race` or ...
Just `Promise#then`.