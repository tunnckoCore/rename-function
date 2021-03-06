# [rename-function][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Rename a given function. Tries to be cross-platform and guaranteed. Useful when you want to preserve name of bound function. In bonus, allows passing context to the renamed function.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
```
npm i rename-function --save
```

## How it works? Strategy. Name priority.

There's a couple of things that you **should be aware off and make your attention**, few scenarios - you can do few things with package like this - rename function, binding function with context and both together.

- Just rename given `fn` to have `name` instead of original name.
- Throw `TypeError` if given `fn` not a function.
- If only `fn` is given, it is returned without modifications - nothing done.
- If `fn` is given and falsey `name` (meaning non-string) - just returns the `fn` - nothing done.
- If `fn` is given and `name` is same as original name - just returns the `fn` - nothing done.
- If `fn`, `name` and `ctx` is given, and `name` is as original - returns function with `ctx` and same name.
- If `fn` and `ctx` is given, then function remains the same - only `ctx` is bound.

Meaning, this package try to follow native behaviours. Because you can't do such thing

```js
function zooparks () { return this }

var boundOne = renameFunction(zooparks, {foo: 'one'})
var boundTwo = renameFunction(boundOne, {foo: 'two'})
var boundZzz = renameFunction(boundTwo, {foo: 'zzz'})

console.log(boundZzz()) // => {foo: 'one'}
```

and expect `boundZzz()` to return `{foo: 'zzz'}`, it would be `{foo: 'one'}` always. It's still a bit strange even to me, because of use the thing that I call "smart binding" with which I tried to solve this problem and will continue. Kinda strange, when debugging it seems it shows expected results. But in other hand that's the native behaviour, see this one:

```js
function zooparks () { return this }

var boundOne = zooparks.bind({foo: 'one'})
var boundTwo = boundOne.bind({foo: 'two'})
var boundZzz = boundTwo.bind({foo: 'zzz'})

console.log(boundZzz()) // => {foo: 'one'}
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const renameFunction = require('rename-function')
```

### [renameFunction](index.js#L42)
> Rename given `fn` with `name`. If given `name` is same as old, then the `fn` is just returned earlier, nothing more is done.

**Params**

* `fn` **{Function}**    
* `name` **{String|Object}**    
* `ctx` **{Object}**    
* `returns` **{Function}**: or throws `TypeError` if `fn` not a function  

**Example**

```js
var rename = require('rename-function')
var getName = require('get-fn-name')

var fn = rename(fixture () {}, 'abc')

console.log(getName(fn)) // => 'abc'
console.log(fn.name) // => 'abc'

// passing context
var bound = rename(fixture foo () { return this }, 'zoo', {a: 'b'})
console.log(bound()) // => {a: 'b'}
console.log(bound.name) // => 'zoo'
console.log(getName(bound)) // => 'zoo'
```

## Related
* [bind-context](https://www.npmjs.com/package/bind-context): Bind context to a function and preserves her name. Can be used… [more](https://www.npmjs.com/package/bind-context) | [homepage](https://github.com/tunnckocore/bind-context)
* [function-arguments](https://www.npmjs.com/package/function-arguments): Get arguments of a function, useful for and used in dependency injectors.… [more](https://www.npmjs.com/package/function-arguments) | [homepage](https://github.com/tunnckocore/function-arguments)
* [is-async-function](https://www.npmjs.com/package/is-async-function): Is function really asynchronous function? Trying to guess that based on check… [more](https://www.npmjs.com/package/is-async-function) | [homepage](https://github.com/tunnckocore/is-async-function)
* [is-bound-function](https://www.npmjs.com/package/is-bound-function): Check if given function is bound or not. | [homepage](https://github.com/tunnckocore/is-bound-function)
* [is-callback-function](https://www.npmjs.com/package/is-callback-function): Returns true if function is a callback. Checks its name is one… [more](https://www.npmjs.com/package/is-callback-function) | [homepage](https://github.com/tunnckocore/is-callback-function)
* [parse-function](https://www.npmjs.com/package/parse-function): Parse a function, arrow function or string to object with name, args,… [more](https://www.npmjs.com/package/parse-function) | [homepage](https://github.com/tunnckocore/parse-function)
* [smart-bind](https://www.npmjs.com/package/smart-bind): Smarter binding of function with some context. It uses .apply instead of… [more](https://www.npmjs.com/package/smart-bind) | [homepage](https://github.com/tunnckocore/smart-bind)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/rename-function/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[define-property]: https://github.com/jonschlinkert/define-property
[get-fn-name]: https://github.com/tunnckocore/get-fn-name
[is-extendable]: https://github.com/jonschlinkert/is-extendable
[lazy-cache]: https://github.com/jonschlinkert/lazy-cache
[namify]: https://github.com/jonschlinkert/namify

[npmjs-url]: https://www.npmjs.com/package/rename-function
[npmjs-img]: https://img.shields.io/npm/v/rename-function.svg?label=rename-function

[license-url]: https://github.com/tunnckoCore/rename-function/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/rename-function
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/rename-function.svg

[travis-url]: https://travis-ci.org/tunnckoCore/rename-function
[travis-img]: https://img.shields.io/travis/tunnckoCore/rename-function/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/rename-function
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/rename-function.svg

[david-url]: https://david-dm.org/tunnckoCore/rename-function
[david-img]: https://img.shields.io/david/tunnckoCore/rename-function.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

