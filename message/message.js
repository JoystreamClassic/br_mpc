/**
 * The parent class for all message classes
 * Created by Bedeho Mender on 02.07.2014.
 */

var is_int = require('../utilities').is_int;
var NUM_MSG = require('../variables').NUM_MSG;

/**
 * Constructor for message class
 * @param {Number} id
 */
function message(id) {

	this.id = id;
	
	/**
	* Check that id is valid
	* 1) number
	* 2) integer
	* 3) 0 <= id <= 16
	*/
	if(!is_int(id) || id < 0 || id >= NUM_MSG) {
		throw new Error('Invalid message id' + id);
	}
}

module.exports = message;

/**
 *  Recover message into raw buffer form
 */
message.prototype._toBuffer = function() {
	
	// Return fresh buffer
	return new Buffer([this.id]);
};


/**
 *  Transform raw buffer into message
 */
message.prototype._parseBuffer = function(buffer, requiredFields) {

    var id = buffer[0];

    var d;

    try {
        d = bencode.decode(buffer.slice(1,buffer.length));
    } catch (e) {
        throw new Error('Invalid encoding: ' + e);
    }

    // Check that all keys are present
    requiredFields.forEach(function(f) {
        if(!(f in d))
            throw new Error('Invalid argument: ' + f + ' field missing');
    });

    // Add id field
    d.id = id;

    return d;
}