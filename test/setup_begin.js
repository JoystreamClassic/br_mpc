/**
 * Tests for setup_begin class
 * Created by Bedeho Mender on 02.07.2014.
 */

var expect = require('chai').expect;

var setup_begin = require('../message/setup_begin');
var fixtures = require('./fixtures/setup_begin.json');

describe('setup_begin', function () {

    var fn = function (arg) {

        // function which chai will call
        return function () {
            return new setup_begin(arg);
        };
    };

    describe('constructor throws when passed ', function () {

        it('to few arguments', function () {
            expect(function() {return new setup_begin();}).to.throw('Invalid argument: To few arguments provided.');
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

});