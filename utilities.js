/**
 * Miscellaneous utilities
 */

/**
 * Message object creation factory
 * @param  {Buffer} buffer
 */
module.exports.messageFactory = function(buffer) {
	
	var Message = require('./message/Message')
	
	var id = buffer[0];
	
	switch (id) {
	
		case Message.ID.list:
			return new require('./message/ListMessage')(buffer)
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
