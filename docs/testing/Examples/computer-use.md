---
title: Computer Use Agent
---

# Intro

Anthropic has recently announced a [Computer Use Agent](https://docs.anthropic.com/en/docs/build-with-claude/computer-use), an AI Agent capable
of interacting with a computer desktop environment. For this example, we prompt the agent to act as a QA engineer with the knowledge about the documentation of 
the Invariant SDK and the Invariant Explorer UI, and we ask it to perform tasks related to testing the agent.

## Running the example

You can run the example discussed in this notebook by running the following command in the root of the repository:

```bash
poetry run invariant test sample_tests/demos/computer_use_agent.py --push --dataset_name computer_use_agent
```

!!! note

    If you want to run the example without sending the results to the Explorer UI, you can always run without the `--push` flag. You will still see the parts of the trace that fail 
    as higihlighted in the terminal.

## Global assertions

There are often assertions that we always want to check for, and it should never be the case that the agent violates them, regardless of the input prompt.
Each global assertion is a function that takes a `Trace` object and runs some assertions on it.

One such assertion is to make sure that the agent never clicks on the firefox hamburger menu on the right, which it ocassionally does as the agent thinks it may be part of the application.
We can check this assertion by iterating over all the tool outputs that contain an image and checking that they do not contain both the text "New tab" and "New window" (which is high indicator that the agent clicked on the menu).

```python
def does_not_click_on_firefox_menu(trace: Trace):
    """Agent should not click on the firefox hamburger menu on the right."""
    for tool_out in trace.tool_outputs(data_type="image"):
        assert_false(tool_out["content"].ocr_contains_all("New tab", "New window"))
```

Next, we can make sure that tool outputs do not contain `ModuleNotFoundError`, which typically indicates coding mistakes that the agent made.
```python
def does_not_make_python_error(trace: Trace):
    """Agent should not produce code that results in ModuleNotFoundError."""
    for tool_out in trace.messages(role="tool"):
        assert_false(tool_out["content"].contains("ModuleNotFoundError"))
```

We also noticed that the agent often overwrites the existing files using the `create` command. We can add a check for that:
```python
def does_not_make_file_edit_errors(trace: Trace):
    """Given a trace, assert that the agent does not make a file edit error."""
    for tool_out in trace.tool_outputs():
        assert_false(tool_out["content"].contains("Cannot overwrite files using command `create`."))
```

## Unit tests

Now we can write unit tests for specific test cases. We are going to give the agent a range of tasks - e.g. annotating a snippet, uploading a dataset using
either SDK or a browser, etc.

### Task 1: Annotate the first comment in the snippet

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/1" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In the first test, we ask the agent to go to a snippet in the Explorer and annotate the first comment with the text "nice nice".
We run the agent by calling `run_agent`, which runs the agent and returns a `Trace` object.

```python
def test_annotation():
    trace = run_agent("""Go to this snippet https://explorer.invariantlabs.ai/trace/9d55fa77-18f5-4a3b-9f7f-deae06833c58
        and annotate the first comment with: "nice nice" """)

    with trace.as_context():
        trace.run_assertions(global_asserts)
        assert_true(trace.messages(0)["content"].contains("nice nice"))
        
        expect_true(max(F.frequency(
            F.filter(
                lambda x: "http" in x.value, 
                F.map(lambda tc: tc["function"]["arguments"]["text"], trace.tool_calls({"arguments.action": "type", "name": "computer"}))
            )
        ).values()) <= 1)

        # assert that the last screenshot contains the text "annotated" and text "nice nice"
        last_screenshot = trace.messages(role="tool")[-1]["content"]
        assert_true(last_screenshot.ocr_contains_all("annotated", "nice nice"))
```

We first use `F.map` to get the `text` argument from the `type` command and then filter only for the traces that contain the string `http` (so we know they refer to the URL)
In the last part, we take the last screenshot and assert that it contains both "annotated" and "nice nice" using `ocr_contains_all` that uses Tesseract to perform OCR on the image.

### Task 2: Upload traces using UI

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/2" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In the second test, we ask the agent to upload a dataset consisting of 100 traces using a browser. Here, we only check the global assertions:

```python
def test_firefox_menu():
    trace = run_agent("""upload a dataset of 100 traces using a browser""")
    with trace.as_context():
        trace.run_assertions(global_asserts)
```

### Task 3: Empty dataset and upload traces using SDK 

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/3" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

Next test asks the agent to create an empty dataset and then upload 4 traces to it using the SDK.
Here, in addition to global assertions, we also assert that the agent uses `str_replace_editor` command in which `file_text` argument
contains `create_request_and_push_trace` string.

```python
def test_food_dataset():
    trace = run_agent("""create an empty dataset "chats-about-food", then use sdk to push 4 different traces 
    to it and then finally use sdk to update the metadata of the dataset to have "weather="snowy day" and "mood"="great"
    after that go to the UI and verify that there are 4 traces and metadata is good""")
    with trace.as_context():
        trace.run_assertions(global_asserts)
        assert_true(F.any(F.map(
                    lambda x: x["function"]["arguments"]["file_text"].contains("create_request_and_push_trace"),
                    trace.tool_calls(name="str_replace_editor"))))
```

### Task 4: Using Anthropic SDK and creating a dataset

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/4" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In this test case we ask the agent to use Anthropic SDK to generate some traces and upload them to the Explorer using Invariant SDK.
Here, we would like to assert that the dataset created using the SDK actually appears in the UI later on.

```python
def test_anthropic():
    trace = run_agent("""use https://github.com/anthropics/anthropic-sdk-python to generate some traces and upload them 
    to the explorer using invariant sdk. your ANTHROPIC_API_KEY is already set up with a valid key""")
    with trace.as_context():
        trace.run_assertions(global_asserts)

        edit_tool_calls = trace.tool_calls(
            {"name": "str_replace_editor", "arguments.command": "create"}
        )
        file_text = edit_tool_calls[0]["function"]["arguments"]["file_text"]
        assert_true(file_text.contains_any("import anthropic", "from anthropic import"))

        # Extract the dataset name from a tool output and check if it's in the last screenshot
        tool_outs = trace.messages(role="tool")
        dataset_name = F.match(r"Dataset: (\w+)", F.map(lambda x: x["content"], tool_outs), 1)[0]
        tool_out = trace.messages(role="tool")[-1]
        assert_true(tool_out["content"].ocr_contains(dataset_name))
```

First, we have a simple assertion that checks whether the agent imports `anthropic` Python library in two different ways
using `contains_any` function.

For this, we need two things:
1. Extract the dataset name from the tool output using a regex: `Dataset: (\w+)`, for instance `dataset_name` is `claude_examples`
2. We can assert that the dataset name is present in the last screenshot using `ocr_contains` function.

### Task 5: FastAPI application

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/5" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>


In this test, we use the agent to create a FastAPI application with an endpoint that counts the number of words in a string.
First, we assert that the agent does not run any bash command that results in a "Permission denied" error.
Then, in the second part, we assert that the agent edits the same file in two different tool calls.

```python
def test_code_agent_fastapi():
    trace = run_agent("""use fastapi to create a count_words api that receives a string and counts 
    the number of words in it, then write a small client that tests it with a couple of different inputs""")

    with trace.as_context():
        trace.run_assertions(global_asserts)

        for tool_call, tool_out in trace.tool_pairs():
            assert_false(
                tool_call["function"]["name"] == "bash"
                and tool_out.get("content", "").contains("Permission denied")
            )

        tool_calls = trace.tool_calls({"name": "str_replace_editor"})
        max_freq = max(F.frequency(F.map(lambda x: x["function"]["arguments"]["file_text"], tool_calls)).values())
        assert_true(max_freq <= 2, "At least 3 edits to the same file with the same text")
```

First, we find all pairs of tool calls and tool outputs and assert that the content of the tool output corresponding to a `bash` command does not contain `Permission denied` string.
In the second part, we use `F.map` to get the `file_text` argument from the `str_replace_editor` command and then use `max(F.frequency(..).values())` to find the most frequent `file_text`

### Task 6: Code example with Fibonacci sequence

<div class='tiles'>
<a href="https://explorer.invariantlabs.ai/u/mbalunovic/computer_use_agent-1733382354/t/6" class='tile'>
    <span class='tile-title'>Open in Explorer →</span>
    <span class='tile-description'>See this example in the Invariant Explorer</span>
</a>
</div>

In this test, we ask the agent to write a function `compute_fibonacci(n)` that computes the n-th Fibonacci number and test it on a few inputs.
We then assert that executing the code `print(compute_fibonacci(12))` results in the `144` being present in the standard output (note that this asssertion requires 
Docker to be installed).

```python
def test_fibonacci():
    trace = run_agent(
        """write me a python function compute_fibonacci(n) that computes n-th fibonacci number and test it on a few inputs"""
    )
    with trace.as_context():
        trace.run_assertions(global_asserts)

        tool_calls = trace.tool_calls({"name": "str_replace_editor", "arguments.command": "create"})
        for tc in tool_calls:
            res = tc["function"]["arguments"]["file_text"].execute_contains("144", "print(compute_fibonacci(12))")
            assert_true(res, "Execution output does not contain 144")
```

For this we used `.execute_contains` function that executes the code in the string inside of Docker containerand checks whether the output contains the expected substring.

## Conclusion

We have seen how to write global assertions that are always checked for, and how to write unit tests for specific test cases.
