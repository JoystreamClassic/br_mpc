/**
 * The subclass for setup_begin message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;

var is_int = require('../utilities').is_int;
var is_positive_int = require('../utilities').is_positive_int;


/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message (excluding id)
 *  or
 *  @param {Object} object with fields: currency,bandwidth,fee,lock_time
 */
function setup_begin(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.setup_begin, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(setup_begin, message);

module.exports = setup_begin;

/**
 *  Check that message is valid
 */
setup_begin.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.setup_begin, ['currency','bandwidth','fee','lock_time']);

    // currency
    if (!(is_int(this.currency) && this.currency < NUM_CURRENCIES))
        throw new Error('Invalid currency: ' + this.currency);

    // bandwidth
    if (!is_positive_int(this.bandwidth))
        throw new Error('Invalid bandwidth: ' + this.bandwidth);

    // fee
    if (!is_positive_int(this.fee))
        throw new Error('Invalid fee: ' + this.fee);

    // lock_time
    if (!is_positive_int(this.lock_time))
        throw new Error('Invalid lock_time: ' + this.lock_time);

};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
setup_begin.prototype._parseBuffer = function(wrapper) {

    // currency
    try {
        var currency = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid currency field');
    }

    // bandwidth
    try {
        var bandwidth = wrapper.readUInt32BE();
    } catch (e) {
        throw new Error('Buffer to small: invalid bandwidth field');
    }

    // fee
    try {
        var fee = wrapper.readUInt32BE();
    } catch (e) {
        throw new Error('Buffer to small: invalid fee field');
    }

    // lock_time
    try {
        var lock_time = wrapper.readUInt32BE();
    } catch (e) {
        throw new Error('Buffer to small: invalid lock_time field');
    }

    // Return object with all fields
    return {'currency' : currency,
            'bandwidth' : bandwidth,
            'fee' : fee,
            'lock_time' : lock_time};
};

/**
 *  Transform message into raw buffer form
 */
setup_begin.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + 1 + 3*4;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeUInt8(this.currency);
    wrapper.writeUInt32BE(this.bandwidth);
    wrapper.writeUInt32BE(this.fee);
    wrapper.writeUInt32BE(this.lock_time);

    // Return buffer
    return buffer;
};

/**
 *  Compare setup_begin messages
 *  {setup_begin} obj, note: we never actually check that object has necessary fields
 */
setup_begin.prototype.equals = function (obj) {

    // id
    if(this.id != obj.id)
        return false;

    // currency
    if(this.currency != obj.currency)
        return false;

    // bandwidth
    if(this.bandwidth != obj.bandwidth)
        return false;

    // fee
    if(this.fee != obj.fee)
        return false;

    // lock_time
    if(this.lock_time != obj.lock_time)
        return false;

    // Return true
    return true;
};