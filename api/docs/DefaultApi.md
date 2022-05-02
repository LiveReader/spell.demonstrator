# SpellApi.DefaultApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDataObject**](DefaultApi.md#createDataObject) | **POST** /dataObject | Create a new DataObject and subordinate DataObject
[**debug**](DefaultApi.md#debug) | **GET** /debug | Get the whole Jena model in JSON-LD representation
[**deleteAttribute**](DefaultApi.md#deleteAttribute) | **DELETE** /attribute | Delete an attribute object
[**deleteDataObject**](DefaultApi.md#deleteDataObject) | **DELETE** /dataObject | Delete a DataObject object
[**getDataObject**](DefaultApi.md#getDataObject) | **GET** /dataObject | Get a specific DataObject by ID
[**getOperationList**](DefaultApi.md#getOperationList) | **GET** /operations | List of operation objects
[**loadScenarios**](DefaultApi.md#loadScenarios) | **POST** /scenario/load | Load a list of scenarios into the database
[**resetDatabase**](DefaultApi.md#resetDatabase) | **POST** /reset | Reset the database to a predefined state
[**updateAttribute**](DefaultApi.md#updateAttribute) | **PUT** /attribute | Update the value of an existing Attribute
[**updateDataObject**](DefaultApi.md#updateDataObject) | **PUT** /dataObject | Update an existing DataObject and subordinate DataObject

<a name="createDataObject"></a>
# **createDataObject**
> createDataObject(body, operationId, parentDataObjectId)

Create a new DataObject and subordinate DataObject

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let body = new SpellApi.DataObject(); // DataObject | The DataObject to create
let operationId = "operationId_example"; // String | Encoded String ID of the Operation DataObject this DataObject belongs to
let parentDataObjectId = "parentDataObjectId_example"; // String | Encoded String ID of the parent DataObject pointing to this DataObject via hasA

apiInstance.createDataObject(body, operationId, parentDataObjectId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DataObject**](DataObject.md)| The DataObject to create | 
 **operationId** | **String**| Encoded String ID of the Operation DataObject this DataObject belongs to | 
 **parentDataObjectId** | **String**| Encoded String ID of the parent DataObject pointing to this DataObject via hasA | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="debug"></a>
# **debug**
> Object debug()

Get the whole Jena model in JSON-LD representation

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
apiInstance.debug((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteAttribute"></a>
# **deleteAttribute**
> deleteAttribute(id, operationId, valueOnly)

Delete an attribute object

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let id = "id_example"; // String | Encoded String ID of the Attribute to delete
let operationId = "operationId_example"; // String | Encoded String ID of the Operation DataObject this Attribute belongs to
let valueOnly = true; // Boolean | 

apiInstance.deleteAttribute(id, operationId, valueOnly, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Encoded String ID of the Attribute to delete | 
 **operationId** | **String**| Encoded String ID of the Operation DataObject this Attribute belongs to | 
 **valueOnly** | **Boolean**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="deleteDataObject"></a>
# **deleteDataObject**
> deleteDataObject(id, operationId, cascadingDelete)

Delete a DataObject object

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let id = "id_example"; // String | Encoded String ID of the DataObject to delete
let operationId = "operationId_example"; // String | Encoded String ID of the Operation DataObject this DataObject belongs to
let cascadingDelete = true; // Boolean | Cascading option will delete all DataObjects connected via asserted hasA (not inferred)

apiInstance.deleteDataObject(id, operationId, cascadingDelete, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Encoded String ID of the DataObject to delete | 
 **operationId** | **String**| Encoded String ID of the Operation DataObject this DataObject belongs to | 
 **cascadingDelete** | **Boolean**| Cascading option will delete all DataObjects connected via asserted hasA (not inferred) | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="getDataObject"></a>
# **getDataObject**
> DataObject getDataObject(id)

Get a specific DataObject by ID

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let id = "id_example"; // String | Encoded String ID of the DataObject to get

apiInstance.getDataObject(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Encoded String ID of the DataObject to get | 

### Return type

[**DataObject**](DataObject.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getOperationList"></a>
# **getOperationList**
> OperationList getOperationList()

List of operation objects

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
apiInstance.getOperationList((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OperationList**](OperationList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="loadScenarios"></a>
# **loadScenarios**
> loadScenarios(body)

Load a list of scenarios into the database

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let body = new SpellApi.ScenarioLoadBody(); // ScenarioLoadBody | 

apiInstance.loadScenarios(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ScenarioLoadBody**](ScenarioLoadBody.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="resetDatabase"></a>
# **resetDatabase**
> resetDatabase()

Reset the database to a predefined state

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
apiInstance.resetDatabase((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="updateAttribute"></a>
# **updateAttribute**
> updateAttribute(id, operationId, attributeValue)

Update the value of an existing Attribute

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let id = "id_example"; // String | Encoded String ID of the Attribute to update
let operationId = "operationId_example"; // String | Encoded String ID of the Operation DataObject this Attribute belongs to
let attributeValue = "attributeValue_example"; // String | The new value of the Attribute

apiInstance.updateAttribute(id, operationId, attributeValue, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Encoded String ID of the Attribute to update | 
 **operationId** | **String**| Encoded String ID of the Operation DataObject this Attribute belongs to | 
 **attributeValue** | **String**| The new value of the Attribute | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="updateDataObject"></a>
# **updateDataObject**
> updateDataObject(body, operationId, parentDataObjectId, updateSubordinateDataObject)

Update an existing DataObject and subordinate DataObject

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let body = new SpellApi.DataObject(); // DataObject | The DataObject and all subordinate DataObjects in their current version
let operationId = "operationId_example"; // String | Encoded String ID of the Operation DataObject this DataObject belongs to
let parentDataObjectId = "parentDataObjectId_example"; // String | Encoded String ID of the parent DataObject pointing to this DataObject via hasA
let updateSubordinateDataObject = true; // Boolean | Decides whether subordinate DataObjects should be updated

apiInstance.updateDataObject(body, operationId, parentDataObjectId, updateSubordinateDataObject, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DataObject**](DataObject.md)| The DataObject and all subordinate DataObjects in their current version | 
 **operationId** | **String**| Encoded String ID of the Operation DataObject this DataObject belongs to | 
 **parentDataObjectId** | **String**| Encoded String ID of the parent DataObject pointing to this DataObject via hasA | 
 **updateSubordinateDataObject** | **Boolean**| Decides whether subordinate DataObjects should be updated | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

