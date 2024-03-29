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
import {ApiClient} from '../ApiClient';

/**
 * The OntologyClass model module.
 * @module model/OntologyClass
 * @version 1.0.0
 */
export class OntologyClass {
  /**
   * Constructs a new <code>OntologyClass</code>.
   * Class from the domain Ontology.
   * @alias module:model/OntologyClass
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>OntologyClass</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OntologyClass} obj Optional instance to populate.
   * @return {module:model/OntologyClass} The populated <code>OntologyClass</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OntologyClass();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'String');
      if (data.hasOwnProperty('label'))
        obj.label = ApiClient.convertToType(data['label'], 'String');
    }
    return obj;
  }
}

/**
 * IRI
 * @member {String} id
 */
OntologyClass.prototype.id = undefined;

/**
 * Name
 * @member {String} label
 */
OntologyClass.prototype.label = undefined;

