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
 * The ScenarioLoadBody model module.
 * @module model/ScenarioLoadBody
 * @version 1.0.0
 */
export class ScenarioLoadBody {
  /**
   * Constructs a new <code>ScenarioLoadBody</code>.
   * @alias module:model/ScenarioLoadBody
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ScenarioLoadBody</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ScenarioLoadBody} obj Optional instance to populate.
   * @return {module:model/ScenarioLoadBody} The populated <code>ScenarioLoadBody</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ScenarioLoadBody();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], ['Number']);
    }
    return obj;
  }
}

/**
 * @member {Array.<Number>} id
 */
ScenarioLoadBody.prototype.id = undefined;

