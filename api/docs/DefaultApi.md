# SpellApi.DefaultApi

All URIs are relative to *http://localhost:8080/v3*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteAttribute**](DefaultApi.md#deleteAttribute) | **DELETE** /attribute/{attributeId} | Delete an attribute object
[**deleteDataObject**](DefaultApi.md#deleteDataObject) | **DELETE** /dataObject/{dataObjectId} | Delete a DataObject object
[**exportGraph**](DefaultApi.md#exportGraph) | **GET** /graph | Export a Notitia JSON dump
[**getOperation**](DefaultApi.md#getOperation) | **GET** /operation/{operationId} | Get a specific operation object by ID
[**getOperationList**](DefaultApi.md#getOperationList) | **GET** /operations | List of operation objects
[**importGraph**](DefaultApi.md#importGraph) | **POST** /graph | Import a Notitia JSON dump
[**loadScenarios**](DefaultApi.md#loadScenarios) | **POST** /scenario/load | Load a list of scenarios into the datatbase
[**resetDatabase**](DefaultApi.md#resetDatabase) | **POST** /reset | Reset the database to a predefined state

<a name="deleteAttribute"></a>
# **deleteAttribute**
> deleteAttribute(attributeId)

Delete an attribute object

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let attributeId = "attributeId_example"; // String | String ID of the Attribute to delete

apiInstance.deleteAttribute(attributeId, (error, data, response) => {
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
 **attributeId** | **String**| String ID of the Attribute to delete | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="deleteDataObject"></a>
# **deleteDataObject**
> deleteDataObject(dataObjectId)

Delete a DataObject object

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let dataObjectId = "dataObjectId_example"; // String | String ID of the DataObject to delete

apiInstance.deleteDataObject(dataObjectId, (error, data, response) => {
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
 **dataObjectId** | **String**| String ID of the DataObject to delete | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="exportGraph"></a>
# **exportGraph**
> NotitiaExportFormat exportGraph()

Export a Notitia JSON dump

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
apiInstance.exportGraph((error, data, response) => {
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

[**NotitiaExportFormat**](NotitiaExportFormat.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getOperation"></a>
# **getOperation**
> OperationObject getOperation(operationId)

Get a specific operation object by ID

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let operationId = "operationId_example"; // String | String ID of the operation to get

apiInstance.getOperation(operationId, (error, data, response) => {
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
 **operationId** | **String**| String ID of the operation to get | 

### Return type

[**OperationObject**](OperationObject.md)

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

<a name="importGraph"></a>
# **importGraph**
> importGraph(body)

Import a Notitia JSON dump

### Example
```javascript
import {SpellApi} from 'spell_api';

let apiInstance = new SpellApi.DefaultApi();
let body = new SpellApi.NotitiaExportFormat(); // NotitiaExportFormat | Node array and link array that are loaded into the DB. The  database will be resetted.

apiInstance.importGraph(body, (error, data, response) => {
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
 **body** | [**NotitiaExportFormat**](NotitiaExportFormat.md)| Node array and link array that are loaded into the DB. The  database will be resetted. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="loadScenarios"></a>
# **loadScenarios**
> loadScenarios(body)

Load a list of scenarios into the datatbase

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

