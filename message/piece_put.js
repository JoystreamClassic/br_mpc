/**
 * The subclass for piece_put message
 * Created by Bedeho Mender on 01.08.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var TX_HASH_SIZE = require('../variables').TX_HASH_SIZE;

var equal_arrays = require('../utilities').equal_arrays;

/**
 *  Constructor for piece_put class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Buffer|String} data
 */
function piece_put(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.piece_put, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(piece_put, message);

module.exports = piece_put;

/**
 *  Check that message is valid
 */
piece_put.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.piece_put, ['data']);

    // data: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.data === 'string')
        this.data = new Buffer(this.data, 'hex');

    // check validity
    if (!Buffer.isBuffer(this.data))
        throw new Error('Invalid data'); //: ' + this.data);
};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
piece_put.prototype._parseBuffer = function(wrapper) {

    // data
    try {
        var contract_hash = wrapper.readBuffer(TX_HASH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid contract_hash field');
    }
    // Return object with all fields
    return {'contract_hash' : contract_hash};
};

/**
 *  Transform message into raw buffer form
 */
piece_put.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + TX_HASH_SIZE;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeBuffer(this.contract_hash);

    // Return buffer
    return buffer;
};

/**
 *  Compare piece_put messages
 *  {piece_put} obj, note: we never actually check that object has necessary fields
 */
piece_put.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            equal_arrays(this.contract_hash, obj.contract_hash);
};