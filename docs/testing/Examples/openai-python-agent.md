---
title: OpenAi Python Agent
---


# Intro

OpenAI's function calling can be used to build agents that integrate with external tools and APIs, allowing the agent to call custom functions and deliver enhanced, context-aware responses. More details can be found here: [OpenAi Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)

This example demonstrates how we validate an OpenAI python agent by using Invariant testing to ensure the agent functions correctly.


## Agent Overview

The agent generates and executes Python code in response to user requests and returns the computed results. It operates under a strict prompt and utilizes the run_python tool to guarantee accurate code execution and adherence to its intended functionality.

A loop is implemented to run the client until the chat is completed without further tool calls. During this process, all chat interactions are stored in `messages`.

## Run the Example

You can run the example by running the following command in the root of the repository:

```bash
poetry run invariant test sample_tests/openai/test_python_agent.py --push --dataset_name test_python_agent
```

!!! note

    If you want to run the example without sending the results to the Explorer UI, you can always run without the `--push` flag. You will still see the parts of the trace that fail 
    as higihlighted in the terminal.


## Unit Tests

Here, we design three unit tests to cover different scenarios.

In these tests, we set varied `input` to reflect different situations. Within each test, we create an instance of the agent named `python_agent`, and retrieve its response by calling `python_agent.get_response(input)`.

The agent's response is subsequently transformed into a Trace object using` TraceFactory.from_openai(response)` for further validation.

### Test 1: Valid Python Code Execution:

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/zishan-wei/openai_python_agent-1733417505/t/1" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In the first test, we ask the agent to calculate the Fibonacci series for the first 10 elements using Python.

```python
def test_python_question():
    input = "Calculate fibonacci series for the first 10 elements in python"
    python_agent = PythonAgent()
    response = python_agent.get_response(input)
    trace = TraceFactory.from_openai(response)
    with trace.as_context():
        run_python_tool_call = trace.tool_calls(name="run_python")
        assert_true(F.len(run_python_tool_call) == 1)
        assert_true(
            run_python_tool_call[0]["function"]["arguments"]["code"].is_valid_code(
                "python"
            )
        )
        assert_true("34" in trace.messages(-1)["content"])
```


Our primary objective is to verify that the agent correctly calls the `run_python` tool and provides valid Python code as its parameter. To achieve this, we first filter the tool_calls where `name = "run_python"`. Then, we assert that exactly one `tool_call` meets this condition. Next, we confirm that the argument passed to the `tool_call` is valid Python code.

```python
run_python_tool_call = trace.tool_calls(name="run_python")
assert_true(F.len(run_python_tool_call) == 1)
assert_true(
    run_python_tool_call[0]["function"]["arguments"]["code"].is_valid_code(
        "python"Secondly, we validate that the Python code executes correctly. To confirm this, we check if the calculated result, "34," is included in the agent's final response.
    )
)
```

Then we validate that the Python code executes correctly. To confirm this, we check if one of the calculated result, "34," is included in the agent's final response.

```python
assert_true("34" in trace.messages(-1)["content"])
```

### Test 2: Invalid Response:

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/zishan-wei/openai_python_agent-1733417505/t/2" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In this test, we use `unittest.mock.MagicMock` to simulate a scenario where the agent incorrectly responds with Java code instead of Python, ensuring such behavior is detected. The actual response from `python_agent.get_response(input)` is replaced with our custom content stored in `mock_invalid_response`


```python

def test_python_question_invalid():
    input = "Calculate fibonacci series for the first 10 elements in python"
    python_agent = PythonAgent()
    mock_invalid_response = [
        {
            "role": "system",
            "content": '\n                    You are an assistant that strictly responds with Python code only. \n                    The code should print the result.\n                    You always use tool run_python to execute the code that you write to present the results.\n                    If the user specifies other programming language in the question, you should respond with "I can only help with Python code."\n                    ',
        },
        {"role": "user", "content": "Calculate fibonacci series for 10"},
        {
            "content": "None",
            "refusal": "None",
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "call_GMx1WYM7sN0BGY1ISCk05zez",
                    "function": {
                        "arguments": '{"code":"public class Fibonacci { public static void main(String[] args) { for (int n = 10, a = 0, b = 1, i = 0; i < n; i++, b = a + (a = b)) System.out.print(a + '
                        '); } }"}',
                        "name": "run_python",
                    },
                    "type": "function",
                }
            ],
        },
    ]
    python_agent.get_response = MagicMock(return_value=mock_invalid_response)
    response = python_agent.get_response(input)
    trace = TraceFactory.from_openai(response)
    with trace.as_context():
        run_python_tool_call = trace.tool_calls(name="run_python")
        assert_true(F.len(run_python_tool_call) == 1)
        assert_true(
            not run_python_tool_call[0]["function"]["arguments"]["code"].is_valid_code(
                "python"
            )
        )

```

In this test we still verify that the agent correctly calls the run_python tool once, but it provids invalid Python code as its parameter. So we assert that the parameter passed to this call is not valid Python code.

```python
run_python_tool_call = trace.tool_calls(name="run_python")
    assert_true(F.len(run_python_tool_call) == 1)
    assert_true(
        not run_python_tool_call[0]["function"]["arguments"]["code"].is_valid_code(
            "python"
        )
    )
```

### Test 3: Non-Python Language Request:

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/zishan-wei/openai_python_agent-1733417505/t/3" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

This test's request included another programming langguage Java and the agent should be able to handle it nicely as clarifyed in the prompt.

This test evaluates the agent's ability to handle requests involving a programming language other than Python, specifically Java. The agent is expected to respond appropriately by clarifying its limitation to Python code as outlined in the prompt.


```python

def test_java_question():
    input = "How to calculate fibonacci series in Java?"
    python_agent = PythonAgent()
    response = python_agent.get_response(input)
    trace = TraceFactory.from_openai(response)
    expected_response = "I can only help with Python code."
    with trace.as_context():
        run_python_tool_call = trace.tool_calls(name="run_python")
        assert_true(F.len(run_python_tool_call) == 0)
        expect_equals(
            "I can only help with Python code.", trace.messages(-1)["content"]
        )
        assert_true(trace.messages(-1)["content"].levenshtein(expected_response) < 5)

```

The first validation confirms that the agent does not call the `run_python` tool.
```python
run_python_tool_call = trace.tool_calls(name="run_python")
assert_true(F.len(run_python_tool_call) == 0)
```

The agent’s response should align closely with `expected_response = "I can only help with Python code."`.
We use the `expect_equals` assertion, which is less strict than `assert_equal`, to validate similarity.

```python
expected_response = "I can only help with Python code."
expect_equals(
            "I can only help with Python code.", trace.messages(-1)["content"]
        )
```
Another way to do it is to use our `levenshtein()` function which calculate Levenshtein distance. So we assert that the Levenshtein distance between the response and the expected response is smaller than 5.

To further confirm similarity, we use `levenshtein()` function to compute the Levenshtein distance. And assert that the Levenshtein distance between the agent's response and the expected output, ensuring it is less than 5.

```python
assert_true(trace.messages(-1)["content"].levenshtein(expected_response) < 5)
```