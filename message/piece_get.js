/**
 * The subclass for piece_get message
 * Created by Bedeho Mender on 01.08.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

var is_positive_int = require('../utilities').is_positive_int;

/**
 *  Constructor for piece_get class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Number} n
 */
function piece_get(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.piece_get, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(piece_get, message);

module.exports = piece_get;

/**
 *  Check that message is valid
 */
piece_get.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.piece_get, ['n']);

    // n
    if(!is_positive_int(this.n))
        throw new Error('Invalid n');

};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
piece_get.prototype._parseBuffer = function(wrapper) {

    // n
    try {
        var n = wrapper.readUInt32BE();
    } catch (e) {
        throw new Error('Buffer to small: invalid n field');
    }
    // Return object with all fields
    return {'n' : n};
};

/**
 *  Transform message into raw buffer form
 */
piece_get.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + 4;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeUInt32BE(this.n);

    // Return buffer
    return buffer;
};

/**
 *  Compare piece_get messages
 *  {piece_get} obj, note: we never actually check that object has necessary fields
 */
piece_get.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            (this.n == obj.n);
};