/**
 * The subclass for setup_begin_accept message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

var PKH_SIZE = require('../variables').PKH_SIZE;
var TX_HASH_SIZE = require('../variables').TX_HASH_SIZE;
var MAX_DER_SIZE = require('../variables').MAX_DER_SIZE;
var MIN_DER_SIZE = require('../variables').MIN_DER_SIZE;

var is_positive_int = require('../utilities').is_positive_int;
var equal_arrays = require('../utilities').equal_arrays;

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message (including id)
 *  or
 *  @param {Object} object with fields:
 *  {Buffer|String} input_hash
 *  {Number} input_i
 *  {Buffer|String} pkh_contract_change
 *  {Buffer|String} pkh_contract_multisig
 *  {Buffer|String} pkh_payment
 *  {Buffer|String} s_1
 */
function setup_begin_accept(arg) {

    // Check that we have input
    if(!arg)
        throw new Error('Invalid argument: To few arguments provided.');

    // Call parent class constructor
    message.call(this, MESSAGE_NAME_TO_ID.setup_begin_accept, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(setup_begin_accept, message);

module.exports = setup_begin_accept;

/**
 *  Check that message is valid
 */
setup_begin_accept.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process.call(this, MESSAGE_NAME_TO_ID.setup_begin_accept, ['input_hash','input_i','pkh_contract_change','pkh_contract_multisig','pkh_payment', 's_1']);

    // input_hash: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.input_hash === 'string')
        this.input_hash = new Buffer(this.input_hash, 'hex');

    // check validity
    if (!Buffer.isBuffer(this.input_hash) || this.input_hash.length != TX_HASH_SIZE)
        throw new Error('Invalid input_hash'); //: ' + this.input_hash);

    // input_i
    if(!is_positive_int(this.input_i))
        throw new Error('Invalid input_i: ' + this.input_i);

    // pkh_contract_change: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.pkh_contract_change === 'string')
        this.pkh_contract_change = new Buffer(this.pkh_contract_change, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.pkh_contract_change) || this.pkh_contract_change.length != PKH_SIZE)
        throw new Error('Invalid pkh_contract_change: ' + this.pkh_contract_change);

    // pkh_contract_multisig: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.pkh_contract_multisig === 'string')
        this.pkh_contract_multisig = new Buffer(this.pkh_contract_multisig, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.pkh_contract_multisig) || this.pkh_contract_multisig.length != PKH_SIZE)
        throw new Error('Invalid pkh_contract_multisig: ' + this.pkh_contract_multisig);

    // pkh_payment: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.pkh_payment === 'string')
        this.pkh_payment = new Buffer(this.pkh_payment, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.pkh_payment) || this.pkh_payment.length != PKH_SIZE)
        throw new Error('Invalid pkh_payment: ' + this.pkh_payment);

    // s_1: can be either buffer or hex string,
    // if string, substitute with Buffer instead
    if(typeof this.s_1 === 'string')
        this.s_1 = new Buffer(this.s_1, 'hex');

    // check validity
    if(!Buffer.isBuffer(this.s_1) || this.s_1.length > MAX_DER_SIZE || this.s_1.length < MIN_DER_SIZE)
        throw new Error('Invalid s_1'); // : ' + this.s_1);
};

/**
 *  Parse wrapped raw buffer which is positioned after id field
 */
setup_begin_accept.prototype._parseBuffer = function(wrapper) {

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

    // pkh_contract_change
    try {
        var pkh_contract_change = wrapper.readBuffer(PKH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid pkh_contract_change field');
    }

    // pkh_contract_multisig
    try {
        var pkh_contract_multisig = wrapper.readBuffer(PKH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid pkh_contract_multisig field');
    }

    // pkh_payment
    try {
        var pkh_payment = wrapper.readBuffer(PKH_SIZE);
    } catch (e) {
        throw new Error('Buffer to small: invalid pkh_payment field');
    }

    // s_1

    // Read signature length
    try {
        var signature_length = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid signature_length field');
    }

    // Check that signature has acceptable size
    if(signature_length > MAX_DER_SIZE || signature_length < MIN_DER_SIZE)
        throw new Error('Invalid signature_length.');

    try {
        var s_1 = wrapper.readBuffer(signature_length);
    } catch (e) {
        throw new Error('Buffer to small: invalid s_1 field');
    }

    // Return object with all fields
    return {'input_hash': input_hash,
            'input_i': input_i,
            'pkh_contract_change': pkh_contract_change,
            'pkh_contract_multisig': pkh_contract_multisig,
            'pkh_payment': pkh_payment,
            's_1': s_1};
};

/**
 *  Transform message into raw buffer form
 */
setup_begin_accept.prototype.toBuffer = function() {

    // Calculate net byte size of message
    var TOTAL_BYTE_SIZE = 1 + TX_HASH_SIZE + 4 + 3*PKH_SIZE + 1 + this.s_1.length;

    // Create buffer
    var buffer = new Buffer(TOTAL_BYTE_SIZE);

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // Write fields
    wrapper.writeUInt8(this.id);
    wrapper.writeBuffer(this.input_hash);
    wrapper.writeUInt32BE(this.input_i);
    wrapper.writeBuffer(this.pkh_contract_change);
    wrapper.writeBuffer(this.pkh_contract_multisig);
    wrapper.writeBuffer(this.pkh_payment);
    wrapper.writeUInt8(this.s_1.length); // Write signature length
    wrapper.writeBuffer(this.s_1);

    // Return buffer
    return buffer;
};

/**
 *  Compare setup_begin_accept messages
 *  {setup_begin_accept} obj, note: we never actually check that object has necessary fields
 */
setup_begin_accept.prototype.equals = function (obj) {

    // Return true
    return (this.id == obj.id) &&
            equal_arrays(this.input_hash, obj.input_hash) &&
           (this.input_i == obj.input_i) &&
            equal_arrays(this.pkh_contract_change, obj.pkh_contract_change) &&
            equal_arrays(this.pkh_contract_multisig, obj.pkh_contract_multisig) &&
            equal_arrays(this.pkh_payment, obj.pkh_payment) &&
            equal_arrays(this.s_1, obj.s_1);
};