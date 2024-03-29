/*
 * SPELL API
 * This is an experimental SPELL-Platform server.  You can find out more about SPELL at [https://spell-plattform.de](https://spell-plattform.de). There is no authentication.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: apiteam@spell-plattform.de
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.34
 *
 * Do not edit the class manually.
 *
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.SpellApi);
  }
}(this, function(expect, SpellApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('OperationList', function() {
      beforeEach(function() {
        instance = new SpellApi.OperationList();
      });

      it('should create an instance of OperationList', function() {
        // TODO: update the code to test OperationList
        expect(instance).to.be.a(SpellApi.OperationList);
      });

      it('should have the property nodes (base name: "nodes")', function() {
        // TODO: update the code to test the property nodes
        expect(instance).to.have.property('nodes');
        // expect(instance.nodes).to.be(expectedValueLiteral);
      });

    });
  });

}));
