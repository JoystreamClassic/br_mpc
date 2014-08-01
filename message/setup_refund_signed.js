/**
 * The subclass for setup_refund_signed message
 * Created by Bedeho Mender on 01.08.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var MAX_DER_SIZE = require('../variables').MAX_DER_SIZE;
var MIN_DER_SIZE = require('../variables').MIN_DER_SIZE;

var equal_arrays = require('../utilities').equal_arrays;

/**
 *  Constructor for setup_refund_signed class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Buffer|String} s_2
 */
function setup_refund_signed(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.setup_refund_signed, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(setup_refund_signed, message);

module.exports = setup_refund_signed;

/**
 *  Check that message is valid
 */
setup_refund_signed.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.setup_refund_signed, ['s_2']);

    // s_2: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.s_2 === 'string')
        this.s_2 = new Buffer(this.s_2, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.s_2) || this.s_2.length > MAX_DER_SIZE || this.s_2.length < MIN_DER_SIZE)
        throw new Error('Invalid s_2'); // : ' + this.s_1);
};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
setup_refund_signed.prototype._parseBuffer = function(wrapper) {

    // Read signature length
    try {
        var signature_length = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid signature_length field');
    }

    // Check that signature has acceptable size
    if(signature_length > MAX_DER_SIZE || signature_length < MIN_DER_SIZE)
        throw new Error('Invalid signature_length');

    try {
        var s_2 = wrapper.readBuffer(signature_length);
    } catch (e) {
        throw new Error('Buffer to small: invalid s_2 field');
    }
    // Return object with all fields
    return {'s_2' : s_2};
};

/**
 *  Transform message into raw buffer form
 */
setup_refund_signed.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + 1 + this.s_2.length;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeUInt8(this.s_2.length); // Write signature length
    wrapper.writeBuffer(this.s_2);

    // Return buffer
    return buffer;
};

/**
 *  Compare setup_refund_signed messages
 *  {setup_refund_signed} obj, note: we never actually check that object has necessary fields
 */
setup_refund_signed.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            equal_arrays(this.s_2, obj.s_2);
};