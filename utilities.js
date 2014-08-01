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
 * Check object is a positive integer
 * @param  {Number} value
 */
module.exports.is_positive_int = function(value) {
    return (value >= 0) && module.exports.is_int(value);
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

    // Check that arr has sufficient number of elements
    var num_element = dimensions.reduce(function(p,i) { return p*i;});

    if(num_element != arr.length)
        throw new Error("The number of elements in the array does not match the dimensions");

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

/**
 * Compare two multidimensional arrays
 * @param {Array} arr1
 * @param {Array} arr2
 */
module.exports.equal_arrays = function f(arr1, arr2) {

    // Compare length
    if(arr1.length != arr2.length)
        return false;

    // Compare elements
    for(var i = 0;i < arr1.length;i++) {

        var elm1 = arr1[i];
        var elm2 = arr2[i];

        if (Array.isArray(elm1) && Array.isArray(elm2)) {
            if (!f(elm1, elm2))
                return false;
        } else {
            if (elm1 !== elm2)
                return false;
        }
    }

    // If we got here, they are equal
    return true;
};