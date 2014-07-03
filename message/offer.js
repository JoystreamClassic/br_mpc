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
 *  @param {BitField?} currencies
 *  @param {Array} bandwiths
 */
function offer() {

    if(arguments.length == 0)
        throw new Error('Invalid argument: To few arguments provided.');
    else if(arguments.length == 1) {

        // Don't bother checking if (arguments[0] instanceof Buffer), throw new Error('Invalid argument: Buffer needed.');
        var o = this._parseBuffer(arguments[0]);

        if(o.id != MESSAGE_NAME_TO_ID.offer)
            throw new Error('Invalid argument: Incorrect message id.');
        else
            message.call(this, o.id);

        this.currencies = o.currencies;
        this.bandwidths = o.bandwidths;
        this.price = o.price;
        this.fee = o.fee;
        this.minimum = o.minimum;
    } else if(arguments.length >= 5){

        message.call(this, MESSAGE_NAME_TO_ID.offer);

        this.currencies = arguments[0];
        this.bandwidths = arguments[1];
        this.price = arguments[2];
        this.fee = arguments[3];
        this.minimum = arguments[4];
    }

    // Check that message fields are well formed and consistent
    this._validate();
}

module.exports = offer;

// Inherit from Message class
inherits(offer, message);

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
    b2 = bencode(o);

    // Combine temporary buffers and return result
    return Buffer.concat([b1, b2]);
};

/**
 *  Transform raw buffer into message
 */
offer.prototype._parseBuffer = function(buffer) {

    /*
    // Check that at least id is present,
    // in practice this is double check,
    // but needed in case message is called from else where
    if(buffer.length > 0)
        throw new Error('Buffer empty');
    else
     var id = buffer[0];
    */

    var id = buffer[0];

    var d;

    try {
        d = bencode.decode(buffer.slice(1,buffer.length));
    } catch (e) {
        throw new Error('Invalid encoding: ' + e);
    }

    // Check that all keys are present
    ['currencies','bandwidths','price','fee','minimum'].forEach(function(f) {
        if(!(f in d))
            throw new Error('Invalid argument: ' + f + ' field missing');
    });

    // Add id field
    d.id = id;

    return d;
}

/**
 *  Check that message is valid
 */
offer.prototype._validate = function() {

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

    var numberOfCurrencies = this.currencies.length;
    var numberOfBandwidths = this.bandwidths.length;

    if(schedule.length != numberOfCurrencies)
        throw new Error('Invalid ' + field +' field: incorrect number of currencies');

    // Each field has, for each currency, one value per speed
    for(var i = 0;i < numberOfCurrencies;i++) {

        if(!Array.isArray(schedule[i]))
            throw new Error('Invalid ' + field +'[' + i + ']: not of type Array');
        else if(schedule[i].length != numberOfBandwidths)
            throw new Error('Invalid ' + field +'[' + i + ']: incorrect number of bandwidths');
        else {
            schedule[i].forEach(function(b) {
                if(!is_int(b) || b < 0)
                    throw new Error('Invalid ' + field +'[' + i + ']: contains invalid bandwidth' + b);
            });
        }
    }
}