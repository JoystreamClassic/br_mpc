/**
 * The subclass for setup_refund message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var TX_HASH_SIZE = require('../variables').TX_HASH_SIZE;

var equal_arrays = require('../utilities').equal_arrays;

/**
 *  Constructor for setup_refund class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Buffer|String} contract_hash
 */
function setup_refund(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.setup_refund, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(setup_refund, message);

module.exports = setup_refund;

/**
 *  Check that message is valid
 */
setup_refund.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.setup_refund, ['contract_hash']);

    // contract_hash: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.contract_hash === 'string')
        this.contract_hash = new Buffer(this.contract_hash, 'hex');

    // check validity
    if (!Buffer.isBuffer(this.contract_hash) || this.contract_hash.length != TX_HASH_SIZE)
        throw new Error('Invalid contract_hash'); //: ' + this.input_hash);
};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
setup_refund.prototype._parseBuffer = function(wrapper) {

    // contract_hash
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
setup_refund.prototype.toBuffer = function() {

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
 *  Compare setup_refund messages
 *  {setup_refund} obj, note: we never actually check that object has necessary fields
 */
setup_refund.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            equal_arrays(this.contract_hash, obj.contract_hash);
};