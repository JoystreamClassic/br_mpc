/**
 * The subclass for list message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

/**
 *  Constructor for list class
 */
function list() {
	message.call(this, MESSAGE_NAME_TO_ID.list);
}

module.exports = list;

// Inherit from Message class
inherits(list, message);

/**
 *  Recover message into raw buffer form
 */
list.prototype.toBuffer = function() {
	
	// call _toBuffer method in message class
	return this._toBuffer();
};