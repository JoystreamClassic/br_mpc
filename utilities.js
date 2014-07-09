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


// Internal lookup table used by Buffer wrapper routines,quick and dirty.
// I don't trust all the Buffer wrappers out there
var _func_to_size = {
    'UInt8' : 8,
    'UInt16LE': 16,
    'UInt16BE': 16,
    'UInt32LE': 32,
    'UInt32BE': 32,
    'Int8': 8,
    'Int16LE': 16,
    'Int16BE': 16,
    'Int32LE': 32,
    'Int32BE': 32,
    'FloatLE': 32,
    'FloatBE': 32,
    'DoubleLE': 64,
    'DoubleBE': 64
};

/**
 * Wrapper for Buffer.readArrayFromBuffer which reads array
 * @param  {Buffer} buffer
 * @param  {Number} offset
 * @param  {Number} num_elements
 */

module.exports.readArrayFromBuffer = function(buffer, offset, func, num_elements) {

    // Unit size
    var size = _func_to_size[func];

    // Check that buffer has enough space to read from
    if(buffer.length >= offer + num_elements*size) {

        // Create array
        var result = new Array(num_rows);
        for(var i = 0;i < num_elements;i++, offset += size)
            result[i][j] = buffer['read' + func](offset);

    } else
        throw new Error();

    // Return results
    return {'result' : result, 'offset' : offset};
}

/**
 * Wrapper for Buffer.read2DArrayFromBuffer which reads row-major 2D array
 * @param  {Buffer} buffer
 * @param  {Number} offset
 * @param  {Number} num_rows
 * @param  {Number} num_cols
 */

module.exports.read2DArrayFromBuffer = function(buffer, offset, func, num_rows, num_cols) {

    // Unit size
    var size = _func_to_size[func];

    // Check that buffer has enough space to read from
    if(buffer.length >= offer + num_rows*num_cols*size) {

        // Create rows container array
        var result = new Array(num_rows);
        for(var i = 0;i < num_rows;i++){

            // Create row array
            result[i] = new Array(num_cols);

            for(var j = 0;j < num_cols;j++, offset += size)
                result[i][j] = buffer['read' + func](offset);
        }

    } else
        throw new Error();

    // Return results
    return {'result' : result, 'offset' : offset};
};


//fix later!!!

BufferWrapper.prototype._readArray = function(reader_function, dimensions) {

    var dimension_size = dimensions[0];
    var result = []; // new Array(dimension_size);

    // Stop condition: inner dimension
    if(dimensions.length == 1) {

        // Read array, update offset
        for(var i = 0;i < dimension_size;i++)
            result[i] = reader_function.call(this);
    }
    else {

        var dimensions_cut = dimensions.slice(1, dimensions.length);

        // Iterate recursive reads
        for (var i = 0; i < dimension_size; i++)
            result[i] = this._readArray(reader_function, dimensions_cut);
    }

    return result;
};