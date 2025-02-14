---
hide:
    - toc
---

# GetDatasetMetadata API 

<div class='subtitle'>Get the metadata associated with your Dataset</div>

The GetDatasetMetadata API allows you to get the metadata associated with a dataset in a programmatic way.

---
### `get_dataset_metadata` 

The `get_dataset_metadata method` is used to get the metadata for a dataset from the Invariant API using the `dataset_name`.

##### `dataset_name` <span class='type'>str</span> <span class='required'/>

The name of the dataset.

##### `owner_username` <span class='type'>str</span> <span class='optional'/>

The name of the owner of the dataset. If the dataset is not owned by the caller and it is public, pass in the owner_username with the dataset_name to view it metadata.

##### `request_kwargs` <span class='type'>Optional[Dict[str, Any]]</span> <span class='optional'/>

Additional keyword arguments to pass to the requests method. Default is `None`.

##### Return Value

##### <span class='type'>Dict</span>

The response object from the Invariant API.

> AsyncClient Example
    ```python
    from invariant_sdk.async_client import AsyncClient
    from invariant_sdk.types.push_traces import PushTracesRequest

    client = AsyncClient()

    dataset_metadata = await client.get_dataset_metadata(dataset_name="some_dataset_name")
    ```

> Client Example
    ```python
    from invariant_sdk.client import Client
    from invariant_sdk.types.push_traces import PushTracesRequest

    client = Client()

    dataset_metadata = client.get_dataset_metadata(dataset_name="some_dataset_name")
    ```
