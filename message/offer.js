/**
 * The subclass for offer message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;
var bwrapper = require('buffer-wrapper');

var message = require('./message');
//var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;

var is_int = require('../utilities').is_int;
var flattenArray = require('../utilities').flattenArray;
var reshapeArray = require('../utilities').reshapeArray;

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message (excluding id)
 *  or
 *  @param {Object} object with fields: currencies, bandwidths, price, fee, minimum
 */
function offer(arg) {

    // Call parent class constructor
    message.call(this, arg);

    // Do message verification and processing
    this._validate_and_process();
}

// Inherit from Message class
inherits(offer, message);

module.exports = offer;

/**
 *  Check that message is valid
 */
offer.prototype._validate_and_process = function() {

    // Do base message validation
    this.__proto__.__proto__._validate_and_process();

    // Verify that all required fields are present
    ['num_currencies', 'supported_currencies', 'num_bandwidths', 'supported_bandwidths', 'price', 'fee', 'minimum'].forEach(function(f) {
        if(!this[f])
            throw new Error('Field missing: ' + f);
    });

    // Derived properties
    this.numberOfCurrencies = this.currencies.length;
    this.numberOfBandwidths = this.bandwidths.length;

    // Only includes valid currencies
    this.currencies.forEach(function (c) {
        if (!(is_int(c) && c < NUM_CURRENCIES))
            throw new Error('Invalid currency: ' + c);
    });

    // Only includes valid bandwidths
    this.bandwidths.forEach(function(b) {
        if(!(is_int(b) && b > 0))
            throw new Error('Invalid bandwidth: ' + b);
    });

    // Check price/fee/minimum validity
    this._table_check('price');
    this._table_check('fee');
    this._table_check('minimum');
};

offer.prototype._table_check = function (fieldName) {

    // Recover schedule
    var table = this[fieldName];

    // Check that it is of type Array
    if(!Array.isArray(table))
        throw new Error('Invalid ' + fieldName +' field: not of type Array');

    if(table.length != this.numberOfCurrencies)
        throw new Error('Invalid ' + fieldName +' field: incorrect number of currencies');

    // Each field has, for each currency, one value per speed
    for(var i = 0;i < this.numberOfCurrencies;i++) {

        var schedule = table[i];

        if(!Array.isArray(schedule))
            throw new Error('Invalid ' + fieldName +'[' + i + ']: not of type Array');
        else if(schedule.length != this.numberOfBandwidths)
            throw new Error('Invalid ' + fieldName +'[' + i + ']: incorrect number of bandwidths');
        else {
            schedule.forEach(function(n) {
                if(!is_int(n) || n < 0)
                    throw new Error('Invalid ' + fieldName +'[' + i + ']: non-natural number ' + n);
            });
        }
    }
};

/**
 *  Parse raw buffer form
 */
message.prototype._parseBuffer = function(buffer) {

    // Wrap buffer
    var wrapper = new bwrapper(buffer);

    // id
    try {
        var id = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid id field');
    }

    // num_currencies
    try {
        var num_currencies = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid num_currencies field');
    }

    // supported_currencies
    try {
        var supported_currencies = wrapper.readUInt8Array(num_currencies);
    } catch (e) {
        throw new Error('Buffer to small: invalid supported_currencies field');
    }

    // num_bandwidths
    try {
        var num_bandwidths = wrapper.readUInt8();
    } catch (e) {
        throw new Error('Buffer to small: invalid num_bandwidths field');
    }

    // supported_bandwidths
    try {
        var supported_bandwidths = wrapper.readUInt8Array(num_bandwidths);
    } catch (e) {
        throw new Error('Buffer to small: invalid supported_bandwidths field');
    }

    // dim to read
    var dimensions = [num_currencies, num_bandwidths];

    // price
    var num_elements = num_currencies*num_bandwidths;
    try {
        var flat_price_array = wrapper.readUInt32BEArray(num_elements);
    } catch (e) {
        throw new Error('Buffer to small: invalid price field');
    }

    var price = reshapeArray(flat_price_array, dimensions);

    // fee
    try {
        var flat_fee_array = wrapper.readUInt32BEArray(num_elements);
    } catch (e) {
        throw new Error('Buffer to small: invalid fee field');
    }

    var fee = reshapeArray(flat_price_array, dimensions);

    // minimum
    try {
        var flat_minimum_array = wrapper.readUInt32BEArray(num_currencies);
    } catch (e) {
        throw new Error('Buffer to small: invalid fee field');
    }

    var minimum = reshapeArray(flat_minimum_array, dimensions);

    // Return object with all fields
    return {'id' : id,
            'num_currencies' : num_currencies,
            'supported_currencies' : supported_currencies,
            'num_bandwidths' : num_bandwidths,
            'supported_bandwidths' : supported_bandwidths,
            'price' : price,
            'fee' : fee,
            'minimum' : minimum};
};

/**
 *  Transform message into raw buffer form
 */
message.prototype.toBuffer = function() {

    // do later as converse of _parse

    /*
     // Return fresh buffer
     b1 = new Buffer([this.id]);

     // Encode
     b2 = bencode.encode(this.fields);

     // Combine temporary buffers and return result
     return Buffer.concat([b1, b2]);
     */
};
