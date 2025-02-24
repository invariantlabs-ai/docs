---
title: OpenAI Swarm
---

# Testing Swarm Agents

<div class="subtitle">
Test your OpenAI <code>swarm</code> agents.
</div>

OpenAI's [Swarm](https://github.com/openai/swarm) is a powerful framework for building and managing multi-agent systems. In this guide, we will build a capital finder agent that uses tool calling to answer queries about finding the capital of a given country.

## Quickstart

To get started quickly with testing your Swarm agent, you can use the following code snippet. For a more in-depth explanation, please refer to the rest of the guide.

```python
# swarm dependency
from swarm import Agent, Swarm

# for assertions
from invariant.testing import assert_true
from invariant.testing import functional as F

# for swarm testing support
from invariant.testing.wrappers.swarm_wrapper import SwarmWrapper


def get_capital(country_name: str) -> str:
    """Get the capital of a country."""
    pass


agent = Agent(
    name="An agent that helps users learn about the capitals of countries",
    instructions="...",
    functions=[get_capital],
)


def test_agent():
    # prepare test input
    messages = [{"role": "user", "content": "What is the capital of France?"}]

    # prepare swarm
    swarm = Swarm()
    # use Invariant's Swarm wrapper to auto-extract the agent trace
    swarm = SwarmWrapper(swarm)

    # run agent
    response = swarm.run(
        agent=agent,
        messages=messages,
    )

    # make assertions about trace
    trace = SwarmWrapper.to_invariant_trace(response)

    with trace.as_context():
        get_capital_tool_calls = trace.tool_calls(name="get_capital")

        # should have one 'get_capital' tool call
        assert_true(F.len(get_capital_tool_calls) == 1)

```

Run with

```bash
invariant test test.py
```

When running with `--push` you will also be able to inspect your test results in [Explorer](https://explorer.invariantlabs.ai).

<img src="../assets/swarm-explorer.png"
alt="OpenAI Swarm agent testing"
style="width: 200% !important;">

<center>OpenAI Swarm agent testing</center>

## Setup

To use `Swarm`, you need to need to install the corresponding package:

```bash
pip install openai-swarm
```

## Agent code

You can view the full code example of the example agent [here](https://github.com/invariantlabs-ai/invariant/blob/main/invariant/testing/sample_tests/swarm/capital_finder_agent/capital_finder_agent.py)

The agent can be invoked as follows.

```python
from invariant.wrappers.swarm_wrapper import SwarmWrapper
from swarm import Swarm

from .capital_finder_agent import create_agent

swarm_wrapper = SwarmWrapper(Swarm())
agent = create_agent()
messages = [{"role": "user", "content": "What is the capital of France?"}]
response = swarm_wrapper.run(
    agent=agent,
    messages=messages,
)
```

SwarmWrapper is a lightweight wrapper around the Swarm class. The response of its `run(...)` method includes the current Swarm response along with the history of all messages exchanged. This makes it easy to extract the full trace of the agent's execution.

## Running example tests

You can run the example tests discussed in this notebook by running the following command in the root of the repository:

```bash
invariant test sample_tests/swarm/capital_finder_agent/test_capital_finder_agent.py --push --dataset_name swarm_capital_finder_agent
```

!!! note

    If you want to run the example without sending the results to the Explorer UI, you can always run without the `--push` flag. You will still see the parts of the trace that fail
    as higihlighted in the terminal.

## Unit tests

We can now use `testing` to assess the correctness of our agent. We will write two tests to verify different properties of the agents' behavior. For this, we want to verify that:

1. The agent can correctly answer a query about the capital of France.
2. The agent handles correctly when a given capital cannot be determined.

### Test 1: Capital is correctly returned by the Agent

<div class='tiles'>
<a target="_blank" href="https://explorer.invariantlabs.ai/u/hemang1729/swarm_capital_finder_agent-1733695570/t/1" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

```python
def test_capital_finder_agent_when_capital_found(swarm_wrapper):
    """Test the capital finder agent when the capital is found."""
    agent = create_agent()
    messages = [{"role": "user", "content": "What is the capital of France?"}]
    response = swarm_wrapper.run(
        agent=agent,
        messages=messages,
    )
    trace = SwarmWrapper.to_invariant_trace(response)

    with trace.as_context():
        get_capital_tool_calls = trace.tool_calls(name="get_capital")
        assert_true(F.len(get_capital_tool_calls) == 1)
        assert_equals(
            "France", get_capital_tool_calls[0]["function"]["arguments"]["country_name"]
        )

        assert_true(trace.messages(-1)["content"].contains("paris"))
```

We first use the `tool_calls()` method to retrieve all tool calls where the name is `get_capital`. Then, we assert that there is exactly one such tool call. We also assert that the argument `country_name` passed to the tool call is `France`. Additionally, we verify that the last message contains `Paris`, our desired answer.

### Test 2: Capital is not found by the Agent

<div class='tiles'>
<a target="_blank" href="https://explorer.invariantlabs.ai/u/hemang1729/swarm_capital_finder_agent-1733695570/t/2" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

```python
def test_capital_finder_agent_when_capital_not_found(swarm_wrapper):
    """Test the capital finder agent when the capital is not found."""
    agent = create_agent()
    messages = [{"role": "user", "content": "What is the capital of Spain?"}]
    response = swarm_wrapper.run(
        agent=agent,
        messages=messages,
    )
    trace = SwarmWrapper.to_invariant_trace(response)

    with trace.as_context():
        get_capital_tool_calls = trace.tool_calls(name="get_capital")
        assert_true(F.len(get_capital_tool_calls) == 1)
        assert_equals(
            "Spain", get_capital_tool_calls[0]["function"]["arguments"]["country_name"]
        )

        tool_outputs = trace.tool_outputs(tool_name="get_capital")
        assert_true(F.len(tool_outputs) == 1)
        assert_true(tool_outputs[0]["content"].contains("not_found"))

        assert_false(trace.messages(-1)["content"].contains("Madrid"))
```

We use the `tool_calls()` method to retrieve all calls with the name `get_capital`, asserting that there is exactly one such call and that the argument `country_name` is `Spain`.

Next, we use the `tool_outputs()` method to check the outputs for `get_capital` calls, confirming that the call returned `not_found`, as the agent's local dictionary of country-to-capital mappings does not include `Spain`.

Finally, we verify that the last message does not contain `Madrid`, consistent with the absence of `Spain` in the agent's limited mapping.

## Conclusion

This guide has walked you through testing an OpenAI Swarm agent using Invariant. We have seen how to write tests for an agent that finds the capital of a country. We have also seen how to use the `SwarmWrapper` to extract the trace of the agent's execution.

If you want to continue exploring, you can read some of the following chapters next.

<div class='tiles'>

<a href="../../writing/matchers/" class='tile primary'>
    <span class='tile-title'>Matchers →</span>
    <span class='tile-description'>Learn more about Matchers to write assertions</span>
</a>

<a href="../../writing/parameterized-tests/" class='tile primary'>
    <span class='tile-title'>Paremeterized Tests →</span>
    <span class='tile-description'>Learn how to parameterize your tests for more robust testing</span>
</a>

</div>
