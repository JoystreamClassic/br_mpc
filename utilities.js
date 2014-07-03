/**
 * Miscellaneous utilities
 * Created by Bedeho Mender on 02.07.2014.
 */


/**
 * Check object is an integer
 * @param  {Number} value
 */
module.exports.is_int = function(value) {
	
	if((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
};

