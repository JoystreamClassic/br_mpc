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

/**
 * Flatten a multidimensional array
 * @param  {Array} arr, the array to flatten
 */

module.exports.flattenArray = function flattenArray(arr) {

    // Check that argument is array
    if(Array.isArray(arr)) {

        // Declare flat version on array
        var flat = [];

        // Iterate each dimension and flatten
        for(var i = 0; i < arr.length;i++)
            flat = flat.concat(flattenArray(arr[i]));

        // Return flattened version
        return flat;

    } else
        return arr;

};

/**
 * Reshape 1D array
 * @param {Array} arr, the array to flatten
 * @param {Array} dimensions, row major listing of dimensions of desired array
 */
module.exports.reshapeArray = function(arr, dimensions) {

    // Position in array which is presently being read
    var array_read_position = 0;

    // Return result of recursive call
    return _reshape(0);

    // Recursive worker function
    function _reshape(dim) {

        var dimension_size = dimensions[dim];
        var result = []; // new Array(dimension_size);

        // Iterate dimension
        for(var i = 0;i < dimension_size;i++) {

            // Stop condition: inner dimension
            if(dim == dimensions.length - 1)
                v = arr[array_read_position++];
             else
                v = _reshape.call(this, dim + 1);

            result[i] = v;
        }

        return result;
    }
};