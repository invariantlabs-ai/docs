---
title: LangGraph
---

# Intro

LangGraph is a [library](https://github.com/langchain-ai/langgraph) for building stateful, multi-actor applications with LLMs, used to create agent and multi-agent workflows. In this example, we build a weather agent that helps us answer queries about the weather by using tool calling.

## Setup
To use `langgraph`, you need to need to install the corresponding package:

```bash
pip install langgraph
```

## Agent code

You can view the agent code [here](https://github.com/invariantlabs-ai/testing/blob/main/sample_tests/langgraph/weather_agent/weather_agent.py).

This can be invoked as:

```python
from langchain_core.messages import HumanMessage

from .weather_agent import WeatherAgent

invocation_response = WeatherAgent().get_graph().invoke(
    {"messages": [HumanMessage(content="what is the weather in sf")]},
    config={"configurable": {"thread_id": 42}},
)
```


## Running example tests

You can run the example tests discussed in this notebook by running the following command in the root of the repository:

```bash
poetry run invariant test sample_tests/langgraph/weather_agent/test_weather_agent.py --push --dataset_name langgraph_weather_agent
```

!!! note

    If you want to run the example without sending the results to the Explorer UI, you can always run without the `--push` flag. You will still see the parts of the trace that fail
    as higihlighted in the terminal.

## Unit tests

### Test 1:

<div class='tiles'>
<a target="_blank" href="https://explorer.invariantlabs.ai/u/hemang1729/langgraph_weather_agent-1733695457/t/1" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

```python
def test_weather_agent_with_only_sf(weather_agent):
    """Test the weather agent with San Francisco."""
    invocation_response = weather_agent.invoke(
        {"messages": [HumanMessage(content="what is the weather in sf")]},
        config={"configurable": {"thread_id": 42}},
    )

    trace = TraceFactory.from_langgraph(invocation_response)

    with trace.as_context():
        find_weather_tool_calls = trace.tool_calls(name="_find_weather")
        assert_true(F.len(find_weather_tool_calls) == 1)
        assert_true(
            find_weather_tool_calls[0]["function"]["arguments"].contains(
                "San francisco"
            )
        )

        find_weather_tool_outputs = trace.messages(role="tool")
        assert_true(F.len(find_weather_tool_outputs) == 1)
        assert_true(
            find_weather_tool_outputs[0]["content"].contains("60 degrees and foggy")
        )

        assert_true(trace.messages(-1)["content"].contains("60 degrees and foggy"))
```

We first use the `tool_calls()` method to retrieve all tool calls where the name is `_find_weather`, and we assert that there is exactly one such call. We also verify that the argument passed to the tool call includes `San Francisco`.

Next, we use the `messages()` method with the `role="tool"` filter to check the output for `_find_weather` tool call, ensuring that the content of this output contains our desired answer.

Finally, we confirm that the last message also includes our desired answer.

### Test 2:

<div class='tiles'>
<a target="_blank" href="https://explorer.invariantlabs.ai/u/hemang1729/langgraph_weather_agent-1733695457/t/2" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

```python
def test_weather_agent_with_sf_and_nyc(weather_agent):
    """Test the weather agent with San Francisco and New York City."""
    _ = weather_agent.invoke(
        {"messages": [HumanMessage(content="what is the weather in sf")]},
        config={"configurable": {"thread_id": 41}},
    )
    invocation_response = weather_agent.invoke(
        {"messages": [HumanMessage(content="what is the weather in nyc")]},
        config={"configurable": {"thread_id": 41}},
    )

    trace = TraceFactory.from_langgraph(invocation_response)

    with trace.as_context():
        find_weather_tool_calls = trace.tool_calls(name="_find_weather")
        assert_true(len(find_weather_tool_calls) == 2)
        find_weather_tool_call_args = str(
            F.map(lambda x: x.argument(), find_weather_tool_calls)
        )
        assert_true(
            "San Francisco" in find_weather_tool_call_args
            and "New York City" in find_weather_tool_call_args
        )

        find_weather_tool_outputs = trace.messages(role="tool")
        assert_true(F.len(find_weather_tool_outputs) == 2)
        assert_true(
            find_weather_tool_outputs[0]["content"].contains("60 degrees and foggy")
        )
        assert_true(
            find_weather_tool_outputs[1]["content"].contains("90 degrees and sunny")
        )

        assistant_response_messages = F.filter(
            lambda m: m.get("tool_calls") is None, trace.messages(role="assistant")
        )
        assert_true(len(assistant_response_messages) == 2)
        assert_true(
            assistant_response_messages[0]["content"].contains(
                "weather in San Francisco is"
            )
        )
        assert_true(
            assistant_response_messages[1]["content"].contains(
                "weather in New York City is"
            )
        )
```
In this test, we use `F.map` to extract the arguments of the tool calls from the list of tool calls. We then assert that both our queries are present in the arguments list.

There are two types of messages with `role="assistant"`: those where tool calls are made and those corresponding to the final response back to the caller. We use `F.filter` to filter out messages where `role="assistant"` but `tool_calls` is `None`. Finally, we assert that these response messages contain the results of the weather queries.

## Conclusion

We have seen how to to write unit tests for specific test cases when building an agent with the Langgraph library.