/**
 * Miscellaneous utilities
 */

var NAME_TO_ID = require('./variables').NAME_TO_ID
var list = require('./message/list')

/**
 * Message object creation factory based on raw buffer
 * @param  {Buffer} buffer
 */
module.exports.messageFactory = function(buffer) {
	
	var id = buffer[0];
	var restOfBuffer = buffer.slice(1, buffer.length()-1) // is this CORRECT?
	
	switch (id) {
	
		case NAME_TO_ID.list:
			return new list()
	}
}

/**
 * Check object is an integer
 * @param  {Number} value
 */
module.exports.is_int = function(value) {
	
	if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
		return true
	} else { 
		return false;
	} 
}


/*	
	if(arg instanceof Buffer)
		id = arg[0]
	else if(arg.id)
		id = arg
	else
		throw new Error('No id provided')
*/
