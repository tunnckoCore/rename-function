'use strict'

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('define-property')
require('get-fn-name')
require('is-extendable')
require('namify')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

utils.isInvalid = function isInvalid (args, name, isObject) {
  if (args.length === 1) return true
  if (args.length === 2 && !isObject && typeof name !== 'string') return true
  return false
}

/**
 * Expose `utils` modules
 */

module.exports = utils
