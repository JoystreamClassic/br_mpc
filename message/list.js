/**
 * The subclass for list message
 */

message = require('./message')
inherits = require('util').inherits

module.exports = list

// Inherit from Message class
inherits(list, message)

/**
 *  Constructor for list class
 * @param  {Buffer|Object} arg
 */
function list(arg) {
	
	// Call Message constructor
	message.call(this, arg)

}