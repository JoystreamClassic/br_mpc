/**
 * Tests for utilities class
 * Created by Bedeho Mender on 02.07.2014.
 */
var expect = require('chai').expect;
var is_int = require('../utilities').is_int;
var flattenArray = require('../utilities').flattenArray;
var reshapeArray = require('../utilities').reshapeArray;
var equal_arrays = require('../utilities').equal_arrays;

var fixtures = require('./fixtures/utilities.json');

describe('Utilities', function() {

    it('is_int', function () {

        it('False negatives', function () {
            expect(is_int(1)).to.be.true;
            expect(is_int(-1)).to.be.true;
            expect(is_int(0)).to.be.true;
        });

        it('False positives', function () {
            expect(is_int(NaN)).to.be.false;
            expect(is_int(undefined)).to.be.false;
            expect(is_int(3.14)).to.be.false;
        });
    });

    it('flattenArray', function () {

        fixtures.flattenArray.forEach(function (e) {

            var flat = flattenArray(e.array);

            // Check that array is properly flattened
            for (var i = 0; i < flat.length; i++)
                expect(flat[i]).to.equal(i);

            // Lastly, check that flat array matches size of array
            expect(flat.length).to.equal(e.size);
        });

    });

    it('reshapeArray', function () {

        fixtures.reshapeArray.forEach(function (e) {

            var shaped = reshapeArray(e.array, e.dimensions);

            // Check structure
            var next_value = 0;
            check_structure_and_content(0, shaped);

            function check_structure_and_content(dim, arr) {

                // Check that this dimension has the correct size
                expect(arr.length).to.equal(e.dimensions[dim]);

                // Verify that it has correct value
                for (var i = 0; i < arr.length; i++) {

                    // Check if this is last dimension
                    if (dim == e.dimension - 1)
                        expect(arr[i]).to.equal(next_value++);
                    else // if not, check deeper dimension
                        check_structure_and_content(dim + 1, arr[i]);
                }
            };

        });
    });

    it('equal_arrays', function () {

        fixtures.equal_arrays.forEach(function (e) {

            // Result of comparison
            var eq = equal_arrays(e.arr1, e.arr2);

            // Assert correct output
            expect(eq).to.equal(!!e.result);
        });
    });
});