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
 * The OperationListNodes model module.
 * @module model/OperationListNodes
 * @version 1.0.0
 */
export class OperationListNodes {
  /**
   * Constructs a new <code>OperationListNodes</code>.
   * @alias module:model/OperationListNodes
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>OperationListNodes</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OperationListNodes} obj Optional instance to populate.
   * @return {module:model/OperationListNodes} The populated <code>OperationListNodes</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OperationListNodes();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'String');
      if (data.hasOwnProperty('lastEdited'))
        obj.lastEdited = ApiClient.convertToType(data['lastEdited'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} id
 */
OperationListNodes.prototype.id = undefined;

/**
 * @member {String} lastEdited
 */
OperationListNodes.prototype.lastEdited = undefined;

