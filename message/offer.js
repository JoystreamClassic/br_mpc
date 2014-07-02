/**
 * The subclass for list message
 */

var message = require('./message');
var inherits = require('util').inherits;
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var bencode = require('bencode');

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message, including id
 *  or
 *  @param {BitField} currencies bitfield?
 *  @param {Array} bandwiths
 */
function offer() {

    if(arguments.length == 0)
        throw new Error('Invalid argument: To few arguments provided.');
    else if(arguments.length == 1) {

        // Don't bother checking if (arguments[0] instanceof Buffer), throw new Error('Invalid argument: Buffer needed.');
        var o = _parseBuffer(arguments[0]);

        if(o.id != MESSAGE_NAME_TO_ID.offer)
            throw new Error('Invalid argument: Incorrect message id.');
        else
            message.call(this, o.id);

        this.currencies = o.currencies;
        this.bandwidths = o.bandwidths;
        this.price = o.price;
        this.fee = o.fee;
        this.minimum = o.minimum;
    } else if(arguments.length == 5){

        message.call(this, MESSAGE_NAME_TO_ID.offer);

        this.currencies = arguments[0];
        this.bandwidths = arguments[1];
        this.price = arguments[2];
        this.fee = arguments[3];
        this.minimum = arguments[4];
    } else
        throw new Error('Invalid argument: Incorrect number of arguments provided');

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

    // Check that at least id is present,
    // in practice this is double check,
    // but needed in case message is called from else where
    if(buffer.length > 0)
        throw new Error('Buffer empty');
    else
        var id = buffer[0];

    var d;

    try {
        d = bencode.decode(buffer.slice(1,buffer.length));
    } catch (e) {
        throw new Error('Invalid encoding: ' + e);
    }

    // Check that all keys are present
    for(s in ['currencies','bandwidths','price','fee','minimum'])
        if(!(s in d)) throw new Error('Invalid argument: ' + s + ' field missing');

    // Add id field
    d.id = id;

    return d;
}

/**
 *  Check that message is valid
 */
offer.prototype._validate = function() {

    /* not done yet*/
}