/**
 * The subclass for list message
 */

var message = require('./message');
var inherits = require('util').inherits;
var NAME_TO_ID = require('../variables').NAME_TO_ID;

/**
 *  Constructor for list class
 */
function list() {
	message.call(this, NAME_TO_ID.list);
}

module.exports = list;

// Inherit from Message class
console.log('we are inheriting!')
inherits(list, message);

/**
 *  Recover message into raw buffer form
 */
list.prototype.toBuffer = function() {
	
	// call _toBuffer method in message class
	return this._toBuffer();
};

var x = new list();

console.log('ok we are here')

/*	
	if(arg instanceof Buffer)
		id = arg[0]
	else if(arg.id)
		id = arg
	else
		throw new Error('No id provided')
*/