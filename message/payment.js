/**
 * The subclass for payment message
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
 *  Constructor for payment class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Buffer|String} s_3
 */
function payment(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.payment, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(payment, message);

module.exports = payment;

/**
 *  Check that message is valid
 */
payment.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.payment, ['s_3']);

    // s_3: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.s_3 === 'string')
        this.s_3 = new Buffer(this.s_3, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.s_3) || this.s_3.length > MAX_DER_SIZE || this.s_3.length < MIN_DER_SIZE)
        throw new Error('Invalid s_3'); // : ' + this.s_1);
};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
payment.prototype._parseBuffer = function(wrapper) {

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
        var s_3 = wrapper.readBuffer(signature_length);
    } catch (e) {
        throw new Error('Buffer to small: invalid s_3 field');
    }
    // Return object with all fields
    return {'s_3' : s_3};
};

/**
 *  Transform message into raw buffer form
 */
payment.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + 1 + this.s_3.length;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeUInt8(this.s_3.length); // Write signature length
    wrapper.writeBuffer(this.s_3);

    // Return buffer
    return buffer;
};

/**
 *  Compare payment messages
 *  {payment} obj, note: we never actually check that object has necessary fields
 */
payment.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            equal_arrays(this.s_3, obj.s_3);
};