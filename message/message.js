/**
 * The parent class for all message classes
 */

var is_int = require('../utilities').is_int 
var NUM_MSG = require('../variables').NUM_MSG

module.exports = message

/**
 * Constructor for Message class
 * @param  {Number} id
 */
function message(id) {

	this.id = id
	
	// Check that id is valid
	// 1) number
	// 2) integer
	// 3) 0 <= id <= 16
	if(!is_int(id) || id < 0 || id >= NUM_MSG)
		throw new Error('Invalid message id' + id)
}
