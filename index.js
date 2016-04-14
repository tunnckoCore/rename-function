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
 * > Rename given `fn` with `name`. If given `name` is same as old,
 * then the `fn` is just returned earlier, nothing more is done.
 *
 * **Example**
 *
 * ```js
 * var rename = require('rename-function')
 * var getName = require('get-fn-name')
 *
 * var fn = rename(fixture () {}, 'abc')
 *
 * console.log(getName(fn)) // => 'abc'
 * console.log(fn.name) // => 'abc'
 *
 * // passing context
 * var bound = rename(fixture foo () { return this }, 'zoo', {a: 'b'})
 * console.log(bound()) // => {a: 'b'}
 * console.log(bound.name) // => 'zoo'
 * console.log(getName(bound)) // => 'zoo'
 * ```
 *
 * @param  {Function} `fn`
 * @param  {String|Object} `name`
 * @param  {Object} `ctx`
 * @return {Function} or throws `TypeError` if `fn` not a function
 * @api public
 */

module.exports = function renameFunction (fn, name, ctx) {
  if (typeof fn !== 'function') {
    throw new TypeError('rename-function: expect `fn` be function')
  }
  var isObject = utils.isExtendable(name)

  if (utils.isInvalid(arguments, name, isObject)) {
    return fn
  }

  var fnName = utils.getFnName(fn) || ''
  ctx = isObject ? name : ctx
  name = typeof name === 'string' ? name : 123
  name = name === 123 ? fnName : utils.namify(name)

  if (fnName === name && !utils.isExtendable(ctx)) {
    return fn
  }

  var str = format('return function %s() { return fn.apply(ctx || this, arguments) }', name)
  var func = (new Function('fn', 'ctx', str))(fn, ctx || this) // eslint-disable-line no-new-func

  utils.defineProperty(func, 'toString', function toString () {
    var named = format('function %s(', name)
    return fn.toString().replace(/^function .*?\(/, named)
  })

  return func
}
