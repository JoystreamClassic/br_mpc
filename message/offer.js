/**
 * The subclass for offer message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
//var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;

var is_int = require('../utilities').is_int;

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
/*
    // Buffer pointer
    var offset = 0;

    // id
    if(buffer.length > offset)
        id = buffer[offset++];
    else
        throw new Error('Buffer to small: invalid id field');

    // num_currencies
    if(buffer.length >= offset + 1)
        num_currencies = buffer[offset++];
    else
        throw new Error('Buffer to small: invalid num_currencies field');

    // supported_currencies
    try {
        var supported_currencies = readArrayFromBuffer(buffer, offset, 'UInt32BE', num_currencies);
    } catch (e) {
        throw new Error('Buffer to small: invalid supported_currencies field');
    }

    // num_bandwidths
    if(buffer.length >= offset + 4) {
        num_bandwidths = buffer.readUInt32BE(offset);
        offset += 4;
    } else
        throw new Error('Buffer to small: invalid num_bandwidths field');

    // supported_bandwidths
    try {
        var supported_bandwidths nonono we need to keep offset = readArrayFromBuffer(buffer, offset, 'UInt32BE', num_bandwidths);
    } catch (e) {
        throw new Error('Buffer to small: invalid supported_bandwidths field');
    }










    
    // price
    if(buffer.length >= ptr + num_currencies*num_bandwidths*4) {

        // read array
        var price = new Array(num_currencies);
        for(var i = 0;i < num_currencies;i++){

            price[i] = new Array(num_bandwidths);

            for(var j = 0;j < num_bandwidths;j++, ptr += 4)
                price[i][j] = buffer.readUInt32BE(ptr);
        }

    } else
        throw new Error('Buffer to small: invalid price field');

    // fee
    if(buffer.length >= ptr + num_currencies*num_bandwidths*4) {

        // read array
        var fee = new Array(num_currencies);
        for(var i = 0;i < num_currencies;i++){

            fee[i] = new Array(num_bandwidths);

            for(var j = 0;j < num_bandwidths;j++, ptr += 4)
                fee[i][j] = buffer.readUInt32BE(ptr);
        }

    } else
        throw new Error('Buffer to small: invalid fee field');

    // minimum
    if(buffer.length >= ptr + num_currencies*num_bandwidths*4) {

        // read array
        var minimum = new Array(num_currencies);
        for(var i = 0;i < num_currencies;i++){

            minimum[i] = new Array(num_bandwidths);

            for(var j = 0;j < num_bandwidths;j++, ptr += 4)
                minimum[i][j] = buffer.readUInt32BE(ptr);
        }

    } else
        throw new Error('Buffer to small: invalid fee field');

    // Return object with all fields
    return {'id' : id,
            'num_currencies' : num_currencies,
            'supported_currencies' : supported_currencies,
            'num_bandwidths' : num_bandwidths,
            'supported_bandwidths' : supported_bandwidths,
            'price' : price,
            'fee' : fee,
            'minimum' : minimum};

            */
};

/**
 *  Transform message into raw buffer form
 */
message.prototype.toBuffer = function() {






    /*
     // Return fresh buffer
     b1 = new Buffer([this.id]);

     // Encode
     b2 = bencode.encode(this.fields);

     // Combine temporary buffers and return result
     return Buffer.concat([b1, b2]);
     */

};
