---
hide:
    - toc
---

# Append Messages API

<div class='subtitle'>Append new messages to an existing trace</div>

The Append Messages API allows you to append new messages to an existing trace in a programmatic way. Within a trace, all the messages are stored as a list of messages.

The SDK includes a timestamp field by default (set to the current time) when calling the API. This timestamp field is used to perform a sorted insert of the new messages into the list of existing messages in the trace. 

It is possible some of the existing messages in the trace don't have any timestamp - in that case the trace creation timestamp is used for the comparison.

This API works on traces within datasets and on standalone traces (snippets) without any datasets.

## Data Types

### `AppendMessagesRequest`

The `AppendMessagesRequest` class holds the request data for a messages append request.

##### `messages` <span class='type'>List[Dict]</span> <span class='required'/>

This represents the new messages to append to the trace. Each `dict` is a single message within a trace - these can represet a user prompt, a tool call, a tool output, etc.

Must be in the [required trace format](../trace-format.md). Must not be empty.

##### `trace_id` <span class='type'>str</span> <span class='required'/>

The id of the trace to which you want to append messages. This has to exist before the Append Messages API can be called and the caller must be the owner of the trace or the dataset containing the trace.


## Pushing Traces

There are two SDK methods to push traces: `append_messages` and `create_request_and_append_messages`. The former accepts the `AppendMessagesRequest` type as an argument and the latter accepts Python-native types as arguments.

### `append_messages` 
The `append_messages` method is used to append messages to an existing trace using a pre-constructed request object.

##### `request` <span class='type'>AppendMessagesRequest</span> <span class='required'/>

The request object containing new messages and the trace id.

##### `request_kwargs` <span class='type'>Optional[Dict[str, Any]]</span> <span class='optional'/>

Additional keyword arguments to pass to the requests method. Default is `None`.

##### Return Value

##### <span class='type'>Dict</span>

The response object from the Invariant API.

> AsyncClient Example
    ```python
    from invariant_sdk.async_client import AsyncClient
    from invariant_sdk.types.append_messages import PushTracesRequest

    client = AsyncClient()

    request = PushTracesRequest(
        messages=[
            {"role": "user", "content": "one"},
            {"role": "assistant", "content": "two \n three"},
        ],
        trace_id="some_trace_id"
    )

    response = await client.append_messages(request)
    ```

### `create_request_and_append_messages`

The `create_request_and_append_messages` method is used to append messages to an existing trace. It creates a request object from the provided messages and trace id and pushes this data to the API.

##### `messages` <span class='type'>List[Dict]</span> <span class='required'/>

This represents the new messages to append to the trace. Each `dict` is a single message within a trace - these can represet a user prompt, a tool call, a tool output, etc.

Must be in the [required trace format](../trace-format.md). Must not be empty.

##### `trace_id` <span class='type'>str</span> <span class='required'/>

The id of the trace to which you want to append messages. This has to exist before the Append Messages API can be called and the caller must be the owner of the trace or the dataset containing the trace.

##### `request_kwargs` <span class='type'>Optional[Mapping]</span> <span class='optional'/>

Additional keyword arguments to pass to the requests method. Default is `None`.

##### Return Value

##### <span class='type'>Dict</span>

The response object from the Invariant API.

> AsyncClient Example
    ```python
    from invariant_sdk.async_client import AsyncClient

    client = AsyncClient()

    messages = [
        {"role": "user", "content": "one"},
        {"role": "assistant", "content": "two \n three"},
    ]

    response = await client.create_request_and_push_trace(
        messages=messages,
        trace_id="some_trace_id"
    )
    ```
