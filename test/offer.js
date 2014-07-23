/**
 * Tests for offer class
 * Created by Bedeho Mender on 02.07.2014.
 */

var expect = require('chai').expect;

var offer = require('../message/offer');
var fixtures = require('./fixtures/offer.json');
// This fixture file only test .price explicitly, but since same checks
// on the two other fields, that is fine for now.

describe('offer', function () {

    var fn = function (arg) {

        // function which chai will call
        return function () {
            return new offer(arg);
        };
    };

    describe('constructor throws when passed ', function () {

        it('to few arguments', function () {
            expect(function() {return new offer();}).to.throw('Invalid argument: To few arguments provided.');
        });

        fixtures.invalid.forEach(function (element) {

            it(element.description, function () {
                expect(fn(element.arguments)).to.throw(element.exception);
            });
        });
    });

    describe('constructor does not throw when passed', function () {

        fixtures.valid.forEach(function (element) {

            it(element.description, function () {
                expect(fn(element.arguments)).to.not.throw();
            });
        });
    });

    describe('composition of encoding and decoding is consistent when passed', function () {

        fixtures.valid.forEach(function (element) {

            it(element.description, function () {

                // Create message from arguments
                var msg = fn(element.arguments)();

                // Create raw buffer version
                var b = msg.toBuffer();

                // Create message from raw buffer version
                var o = new offer(b);

                // Compare them
                expect(o.equals(msg)).to.be.true;
            });
        });
    });

});