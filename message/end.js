/**
 * The subclass for end message
 * Created by Bedeho Mender on 02.07.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

/**
 *  Constructor for end class
 */
function end() {
	message.call(this, MESSAGE_NAME_TO_ID.end);
}

module.exports = end;

// Inherit from Message class
inherits(end, message);