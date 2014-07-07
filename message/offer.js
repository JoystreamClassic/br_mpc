/**
 * The subclass for offer message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;
var NUM_CURRENCIES = require('../variables').NUM_CURRENCIES;
var is_int = require('../utilities').is_int;

/**
 *  Constructor for list class
 *  @param {Buffer} full buffer with raw message, including id
 *  or
 *  @param {Object} object with fields: currencies, bandwidths, price, fee
 */
function offer(arg) {
    message.call(this, MESSAGE_NAME_TO_ID.offer, ['currencies', 'bandwidths', 'price', 'fee'], arg);
}

// Inherit from Message class
inherits(offer, message);

module.exports = offer;

/**
 *  Check that message is valid
 */
offer.prototype._process_and_validate = function() {

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
};

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
};