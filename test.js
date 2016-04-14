/*!
 * rename-function <https://github.com/tunnckoCore/rename-function>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var renameFunction = require('./index')
var getName = require('get-fn-name')
var toString = require('clean-tostring')
var isIstanbul = process.env.running_under_istanbul

// console.log(named())
// console.log(renameFunction(named)())
// console.log(renameFunction(named, '')()) // rename to ''
// console.log(renameFunction(named, 'foo')()) // rename to 'foo'

// console.log(renameFunction(named, 0)()) // return fn
// console.log(renameFunction(named, 123)()) // return fn
// console.log(renameFunction(named, null)()) // return fn
// console.log(renameFunction(named, false)()) // return fn

// console.log('==== named:')
// console.log('ctx', renameFunction(named, {foo: 'bar'})()) // bind context, preserve name
// console.log('ctx', renameFunction(named, false, {foo: 'bar'})()) // bind context, preserve name
// console.log(renameFunction(named, false, 123)()) // return fn
// console.log('ctx,rename:', renameFunction(named, '', {foo: 'bar'})()) // bind context, rename to ''
// console.log('ctx,rename:', renameFunction(named, 'str', {foo: 'bar'})()) // bind context, rename to 'str'
// console.log('ctx,rename:', renameFunction(named, 'class', {foo: 'bar'})()) // bind context, rename to '_class'
// console.log('ctx,rename:', renameFunction(named, 'named', {foo: 'bar'})()) // bind context, rename to 'named'

// console.log('==== anonymous:')
// console.log('ctx', renameFunction(function () { return this }, {bar: 'qux'})()) // bind context, preserve ''
// console.log('ctx', renameFunction(function () { return this }, false, {bar: 'qux'})()) // bind context, preserve ''
// console.log(renameFunction(function () { return this }, false, 123)()) // return fn
// console.log('ctx:', renameFunction(function () { return this }, '', {bar: 'qux'})()) // bind context, preserve ''
// console.log('ctx,rename:', renameFunction(function () { return this }, 'str', {bar: 'qux'})()) // bind context, rename to 'str'
// console.log('ctx,rename:', renameFunction(function () { return this }, 'class', {bar: 'qux'})()) // bind context, rename to '_class'
// console.log('ctx,rename:', renameFunction(function () { return this }, 'anonymous', {bar: 'qux'})()) // bind context, rename to 'anonymous'

// renameFunction(named, ctx) // preserve name, pass context only, continue
// renameFunction(named, null, ctx) // preserve name, pass context only, continue
// renameFunction(named, false, ctx) // preserve name, pass context only, continue

test('should throw TypeError if `fn` not a function', function (done) {
  function fixture () {
    renameFunction(123)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `fn` be function/)
  done()
})

test('should namify `name` if reserved word', function (done) {
  function foo () {}
  var fn = renameFunction(foo, 'class')
  test.strictEqual(getName(fn), '_class')
  done()
})

test('should have correct, actual and updated result of `.toString`', function (done) {
  function bar () { return 123 }
  var qux = renameFunction(bar, 'qux')

  /* istanbul ignore next */
  if (isIstanbul) {
    test.strictEqual(toString(bar), 'function bar() {return 123;}')
    test.strictEqual(toString(qux), 'function qux() {return 123;}')
  } else {
    test.strictEqual(toString(bar), 'function bar() { return 123 }')
    test.strictEqual(toString(qux), 'function qux() { return 123 }')
  }
  done()
})

test('should allow optionally passing a context as third argument', function (done) {
  function qux () { return this.foo }
  var actual = renameFunction(qux, 'abc', {foo: 'bar'})

  test.strictEqual(actual(), 'bar')
  done()
})

test('should be able to pass context by bind/call/apply renameFunction', function (done) {
  function fox () { return this.cat }
  var fn = renameFunction.call({cat: 'abc'}, fox, 'cat')

  test.strictEqual(fn(), 'abc')
  test.strictEqual(getName(fn), 'cat')
  done()
})

test('should work for anonymous function', function (done) {
  var anonymous = renameFunction(function () { return this || 1 })
  test.strictEqual(anonymous.name, '')
  test.strictEqual(getName(anonymous), null)
  test.strictEqual(anonymous(), 1)

  var named = renameFunction(function named () { return this || 2 })
  test.strictEqual(named.name, 'named')
  test.strictEqual(getName(named), 'named')
  test.strictEqual(named(), 2)
  done()
})

test('should work to pass context to anonymous function', function (done) {
  var anonymous = renameFunction(function () { return this.x }, null, {x: 'y'})
  test.strictEqual(anonymous(), 'y')
  done()
})

test('should be able to pass only `fn` and `ctx` and preserve name', function (done) {
  var anonymous = renameFunction(function () { return this || 1 }, {foo: 'bar'})
  var named = renameFunction(function named () { return this || 2 }, {bar: 'qux'})
  test.deepEqual(anonymous(), {foo: 'bar'})
  test.deepEqual(named(), {bar: 'qux'})
  done()
})

test('should return earlier without modifications if `name` is same as original', function (done) {
  var fn = renameFunction(function zzz () {}, 'zzz')
  var actual = toString(fn)
  var expected = 'function zzz() {}'

  test.strictEqual(actual, expected)
  test.strictEqual(fn.name, 'zzz')
  test.strictEqual(getName(fn), 'zzz')
  done()
})
