/**
 * The subclass for setup_begin message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;
var PKH_SIZE = require('../variables').PKH_SIZE;
var TX_HASH_SIZE = require('../variables').TX_HASH_SIZE;

var is_int = require('../utilities').is_int;
var is_positive_int = require('../utilities').is_positive_int;
var equal_arrays = require('../utilities').equal_arrays;

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Number} currency
 *  {Number} bandwidth
 *  {Number} fee
 *  {Number} lock_time
 *  {Buffer|String} input_hash
 *  {Number} input_i
 *  {Buffer|String} pkh_contract_refund
 *  {Buffer|String} pkh_contract_multisig
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
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.setup_begin, ['currency','bandwidth','fee','lock_time','input_hash','input_i','pkh_contract_refund','pkh_contract_multisig']);

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

    // input_hash: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.input_hash === 'string')
        this.input_hash = new Buffer(this.input_hash, 'hex');

    // check validity
    if (!Buffer.isBuffer(this.input_hash) || this.input_hash.length != TX_HASH_SIZE)
        throw new Error('Invalid input_hash: ' + this.input_hash);

    // input_i
    if(!is_positive_int(this.input_i))
        throw new Error('Invalid input_i: ' + this.input_i);

    // pkh_refund: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.pkh_contract_refund === 'string')
        this.pkh_contract_refund = new Buffer(this.pkh_contract_refund, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.pkh_contract_refund) || this.pkh_contract_refund.length != PKH_SIZE)
        throw new Error('Invalid pkh_contract_refund: ' + this.pkh_contract_refund);

    // pkh_contract_multisig: can be either buffer or hex string
    // if string, substitute with Buffer instead
    if(typeof this.pkh_contract_multisig === 'string')
        this.pkh_contract_multisig = new Buffer(this.pkh_contract_multisig, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.pkh_contract_multisig) || this.pkh_contract_multisig.length != PKH_SIZE)
        throw new Error('Invalid pkh_contract_multisig: ' + this.pkh_contract_multisig);
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

    // input_hash
    try {
        var input_hash = wrapper.readBuffer(TX_HASH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid input_hash field');
    }

    // input_i
    try {
        var input_i = wrapper.readUInt32BE();
    } catch (e) {
        throw new Error('Buffer to small: invalid input_i field');
    }

    // pkh_contract_refund
    try {
        var pkh_contract_refund = wrapper.readBuffer(PKH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid pkh_contract_refund field');
    }

    // pkh_contract_multisig
    try {
        var pkh_contract_multisig = wrapper.readBuffer(PKH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid pkh_contract_multisig field');
    }
    // Return object with all fields
    return {'currency' : currency,
            'bandwidth' : bandwidth,
            'fee' : fee,
            'lock_time' : lock_time,
            'input_hash' : input_hash,
            'input_i' : input_i,
            'pkh_contract_refund' : pkh_contract_refund,
            'pkh_contract_multisig' : pkh_contract_multisig };
};

/**
 *  Transform message into raw buffer form
 */
setup_begin.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + 1 + 3*4 + TX_HASH_SIZE + 4 + 2*PKH_SIZE;

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
    wrapper.writeBuffer(this.input_hash);
    wrapper.writeBuffer(this.input_i);
    wrapper.writeBuffer(this.pkh_contract_refund);
    wrapper.writeBuffer(this.pkh_contract_multisig);

    // Return buffer
    return buffer;
};

/**
 *  Compare setup_begin messages
 *  {setup_begin} obj, note: we never actually check that object has necessary fields
 */
setup_begin.prototype.equals = function (obj) {

    return  (this.id == obj.id) &&
            (this.currency == obj.currency) &&
            (this.bandwidth == obj.bandwidth) &&
            (this.fee == obj.fee) &&
            (this.lock_time == obj.lock_time) &&
            equal_arrays(this.input_hash, obj.input_hash) &&
            (this.input_i == obj.input_i) &&
            equal_arrays(this.pkh_contract_refund, obj.pkh_contract_refund) &&
            equal_arrays(this.pkh_contract_multisig, obj.pkh_contract_multisig);
};