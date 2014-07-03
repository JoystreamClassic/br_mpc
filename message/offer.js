/**
 * The subclass for offer message
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
function offer() {

    message.call(this, MESSAGE_NAME_TO_ID.offer);

    if(arguments.length == 0)
        throw new Error('Invalid argument: To few arguments provided.');
    else if(arguments.length == 1) {

        // Don't bother checking if (arguments[0] instanceof Buffer), throw new Error('Invalid argument: Buffer needed.');

        var o = this._parseBuffer(arguments[0]);

        if(o.id != MESSAGE_NAME_TO_ID.offer)
            throw new Error('Invalid argument: Incorrect message id.');
        else
            this._set_and_validate(o.currencies,  o.bandwidths, o.price, o.fee, o.minimum);

    } else if(arguments.length >= 5)
        this._set_and_validate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
}

// Inherit from Message class
inherits(offer, message);

module.exports = offer;

/**
 *  Transform message into raw buffer form
 */
offer.prototype.toBuffer = function() {

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
offer.prototype._parseBuffer = function(buffer) {
    return call(offer.super_, this) .;
    //_parseBuffer(buffer, ['currencies','bandwidths','price','fee','minimum'])
    // how to call parent method!
}

/**
 *  Check that message is valid
 */
offer.prototype._set_and_validate = function(currencies, bandwidths, price, fee, minimum) {

    // Set properties
    this.currencies = currencies;
    this.bandwidths = bandwidths;
    this.price = price;
    this.fee = fee;
    this.minimum = minimum;

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
    this._schedule_check('price');
    this._schedule_check('fee');
    this._schedule_check('minimum');
}

offer.prototype._schedule_check = function (field) {

    // Recover schedule
    var schedule = this[field];

    // Check that it is of type Array
    if(!Array.isArray(schedule))
        throw new Error('Invalid ' + field +' field: not of type Array');

    if(schedule.length != this.numberOfCurrencies)
        throw new Error('Invalid ' + field +' field: incorrect number of currencies');

    // Each field has, for each currency, one value per speed
    for(var i = 0;i < this.numberOfCurrencies;i++) {

        if(!Array.isArray(schedule[i]))
            throw new Error('Invalid ' + field +'[' + i + ']: not of type Array');
        else if(schedule[i].length != this.numberOfBandwidths)
            throw new Error('Invalid ' + field +'[' + i + ']: incorrect number of bandwidths');
        else {
            schedule[i].forEach(function(n) {
                if(!is_int(n) || n < 0)
                    throw new Error('Invalid ' + field +'[' + i + ']: non-natural number ' + n);
            });
        }
    }
}