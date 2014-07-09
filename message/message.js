/**
 * The parent class for all message classes
 * Created by Bedeho Mender on 02.07.2014.
 */

var is_int = require('../utilities').is_int;
var NUM_MSG = require('../variables').NUM_MSG;

/**
 * Constructor for message class
 * @param {Object|Buffer} arg, message fields
 */
function message(id, arg) {

    // Parse if a argument is of type Buffers
    if(Buffer.isBuffer(arg))
        fields = this._parseBuffer(arg);
    else
        fields = arg;

    // Save in object
    for(var k in fields)
        this[k] = fields[k];
}

/**
 *  Check that message is valid
 *  @param {Number} expectedId, the message id expected by the extending class
 */
message.prototype._validate_and_process = function(expectedId) {

    // Check that id field is present
    if(!this.id)
        throw new Error('Field missing: id');

    // Check for correct id value
    if(this.id != expectedId)
        throw new Error('Incorrect message id provided, expected ' + expectedId + ', but got: ' + this.id);

}

module.exports = message;
