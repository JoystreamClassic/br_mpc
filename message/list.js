/**
 * The subclass for list message
 */

message = require('./message')
inherits = require('util').inherits
ID_TO_NAME = require('../variables').ID_TO_NAME

module.exports = list

// Inherit from Message class
inherits(list, message)

/**
 *  Constructor for list class
 */
function list() {
	message.call(this, ID_TO_NAME.list)
}