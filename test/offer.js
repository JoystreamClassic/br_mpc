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

    var fn = function (args) {

        // function which chai will call
        return function () {
            return new offer(args.currencies, args.bandwidths, args.price, args.fee, args.minimum);
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

                var msg = fn(element.arguments)();

                expect(new offer(msg.toBuffer())).to.deep.equal(msg);
            });
        });
    });

});