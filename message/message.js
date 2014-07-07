/**
 * The parent class for all message classes
 * Created by Bedeho Mender on 02.07.2014.
 */

var is_int = require('../utilities').is_int;
var NUM_MSG = require('../variables').NUM_MSG;

/**
 * Constructor for message class
 * @param {Number} id
 * @param {Array of Strings} fieldNames, names of fields
 * @param {Object|Buffer} arg,
 */
function message(id, fieldNames, arg) {

    // Save id
    this.id = id;

    // Quit for empty messages
    if(fieldNames == 0)
        return;

    if(arg instanceof Buffer) {

        try {
            this.fields = bencode.decode(arg);
        } catch (e) {
            throw new Error('Invalid encoding: ' + e);
        }

    } else
        this.fields = arg;

    // Verify that all required fields are present
    fieldNames.forEach(function(f) {
        if(!(f in this.fields))
            throw new Error('Invalid argument: ' + f + ' field missing');
    });

    // Verify validity of message
    this._process_and_validate();
}

module.exports = message;

/**
 *  Transform message into raw buffer form
 */
message.prototype.toBuffer = function() {
	
	// Return fresh buffer
    b1 = new Buffer([this.id]);

    // Encode
    b2 = bencode.encode(this.fields);

    // Combine temporary buffers and return result
    return Buffer.concat([b1, b2]);
};

