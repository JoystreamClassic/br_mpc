/**
 * The subclass for setup_begin message
 * Created by Bedeho Mender on 02.07.2014.
 */


var inherits = require('util').inherits;

var bencode = require('bencode');

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;
var is_int = require('../utilities').is_int;

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message, including id
 *  or
 *  @param {Array} currencies
 *  @param {Array} bandwidths
 *  @param {Array} price
 *  @param {Array} fee
 */
function setup_begin() {

    if(arguments.length == 0)
        throw new Error('Invalid argument: To few arguments provided.');
    else if(arguments.length == 1) {

        // Don't bother checking if (arguments[0] instanceof Buffer), throw new Error('Invalid argument: Buffer needed.');

        var o = this._parseBuffer(arguments[0]);

        if(o.id != MESSAGE_NAME_TO_ID.setup_begin)
            throw new Error('Invalid argument: Incorrect message id.');
        else
            message.call(this, o.id);

        this._set_and_validate(o.currencies,  o.bandwidths, o.price, o.fee, o.minimum);

    } else if(arguments.length >= 5){

        message.call(this, MESSAGE_NAME_TO_ID.setup_begin);

        this._set_and_validate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
}

module.exports = setup_begin;

// Inherit from Message class
inherits(setup_begin, message);

/**
 *  Transform message into raw buffer form
 */
setup_begin.prototype.toBuffer = function() {

    // call _toBuffer method in message class
    b1 = this._toBuffer();

    var o = {
        'currencies' : this.currencies,
        'bandwidths' : this.bandwidths,
        'price' : this.price,
        'fee' : this.fee,
        'minimum' : this.minimum
    };

    // Encode
    b2 = bencode.encode(o);

    // Combine temporary buffers and return result
    return Buffer.concat([b1, b2]);
};

/**
 *  Transform raw buffer into message
 */
setup_begin.prototype._parseBuffer = function(buffer) {
    //return this.super_._parseBuffer(buffer, ['currencies','bandwidths','price','fee','minimum']);
}

/**
 *  Check that message is valid
 */
setup_begin.prototype._validate = function(currencies, bandwidths, price, fee, minimum) {

    // Set properties
    this.currencies = currencies;
    this.bandwidths = bandwidths;
    this.price = price;
    this.fee = fee;
    this.minimum = minimum;

    // Check price/fee/minimum validity
    if(!is_int(n) || n < 0)
        throw new Error('Invalid ' + field +'[' + i + ']: non natural number ' + n);
}
