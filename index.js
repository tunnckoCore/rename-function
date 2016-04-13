/*!
 * rename-function <https://github.com/tunnckoCore/rename-function>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var format = require('util').format
var utils = require('./utils')

/**
 * > Rename given `fn` with `name`. If given `name` is same as old
 * the `fn` is just returned earlier, nothing more is done.
 *
 * **Example**
 *
 * ```js
 * var rename = require('rename-function')
 * ver getName = require('get-fn-name')
 *
 * var fn = rename(fixture () {}, 'abc')
 *
 * console.log(getName(fn)) // => 'abc'
 * console.log(fn.name) // => 'abc'
 * ```
 *
 * @param  {Function} `fn`
 * @param  {String}   `name`
 * @return {Function}
 */
module.exports = function renameFunction (fn, name) {
  if (typeof fn !== 'function') {
    throw new TypeError('rename-function: expect `fn` be function')
  }
  if (typeof name !== 'string') {
    return fn
  }
  if (name === utils.getFnName(fn)) return fn

  name = utils.namify(name)
  var str = format('return function %s(){return fn.apply(this,arguments)}', name)
  var func = (new Function('fn', str))(fn) // eslint-disable-line no-new-func

  utils.defineProperty(func, 'toString', function toString () {
    var named = format('function %s(', name)
    return fn.toString().replace(/^function .*?\(/, named)
  })

  return func
}
