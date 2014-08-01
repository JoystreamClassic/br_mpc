/**
 * The subclass for piece_missing message
 * Created by Bedeho Mender on 01.08.2014.
 */

var inherits = require('util').inherits;

var message = require('./message');
var MESSAGE_NAME_TO_ID = require('../variables').MESSAGE_NAME_TO_ID;

/**
 *  Constructor for piece_missing class
 */
function piece_missing() {
    message.call(this, MESSAGE_NAME_TO_ID.piece_missing);
}

module.exports = piece_missing;

// Inherit from Message class
inherits(piece_missing, message);