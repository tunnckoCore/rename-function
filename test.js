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

test('should throw TypeError if `fn` not a function', function (done) {
  function fixture () {
    renameFunction(123)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `fn` be function/)
  done()
})

test('should return the function if `name` not a string', function (done) {
  var fn = renameFunction(function fixture () {})
  test.strictEqual(getName(fn), 'fixture')
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
