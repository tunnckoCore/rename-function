/*!
 * rename-function <https://github.com/tunnckoCore/rename-function>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var inspect = require('util').inspect
var test = require('assertit')
var renameFunction = require('./index')
var getName = require('get-fn-name')
var toString = require('clean-tostring')
var isIstanbul = process.env.running_under_istanbul

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

test('should respect first context when nested binds (same as native bind behavior)', function (done) {
  function zoopark () { return this.foo }

  var boundOne = renameFunction(zoopark, {foo: 'one'})
  var boundTwo = renameFunction(boundOne, {foo: 'two'})
  var boundZzz = renameFunction(boundTwo, {foo: 'zzz'})

  test.strictEqual(boundOne(), 'one')
  test.strictEqual(boundTwo(), 'one')
  test.strictEqual(boundZzz(), 'one')

  test.strictEqual(inspect(zoopark), inspect(boundOne))
  test.strictEqual(inspect(boundOne), inspect(boundTwo))
  test.strictEqual(inspect(boundTwo), inspect(boundZzz))
  test.strictEqual(inspect(zoopark), inspect(boundZzz))
  done()
})
