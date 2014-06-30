/**
 * The parent class for all message classes
 */

module.exports = message

// Array of messages
var ID = [
	'list',
	'offer',
	'setup_begin',
	'setup_begin_reject',
	'setup_begin_accept',
	'setup_contract',
	'setup_contract_signed',
	'setup_refund',
	'setup_refund_signed',
	'setup_contract_published',
	'setup_completed',
	'piece_get',
	'piece_missing',
	'piece_put',
	'piece_payment',
	'end'	
]

module.exports.ID = ID

// Generate reverse message lookup
var MSG = {}
for(var i = 0;i < ID.length;i++)
	MSG[ID[i]] = i;

module.exports.MSG = MSG

/**
 * Constructor for Message class
 * @param  {Buffer|Number} arg
 */
function message (arg) {
	
	if(arg instanceof Buffer)
		id = arg[0]
	else if(arg.id)
		id = arg
	else
		throw new Error('No id provided')
		
	this._id = id
	this.name = ID[id]
	
	// Check that id is valid
	// 1) number
	// 2) integer
	// 3) 0 <= id <= 16
	if(typeof id != "number" || require('../utilities').is_int || id < 0 || id > 15)
		throw new Error('Invalid message id' + id)
}
