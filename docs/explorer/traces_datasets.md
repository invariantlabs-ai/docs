---
title: Traces and Datasets
---

# Traces

<div class='subtitle'>Format used to represent actions and interactions of an AI agent</div>

Running an agent produces a trace, which is a sequence of events such as user messages, assistant messages, tool calls, and tool outputs.

## Types of events in traces

User can often prompt the agent with a question, e.g. "Hello, how are you?:
> <b>User message</b> <br/><br/>
    The trace typically starts with a user message, which is the prompt given to the agent. This is sometimes the only interaction between the user and the agent that
    then goes and autonomously tries to solve the task, but often such messages can also occur in the middle of the trace (e.g. to provide feedback).
    ```json
    {
        "role": "user",
        "content": "Hello, how are you?"
    }
    ```

The agent can reply to a question, e.g. "Thanks, I am doing great!":
> <b>Assistant message</b> <br/><br/>
    Similarly to the user message, the assistant message is the response of the agent to the user, which can also contain agent's internal thoughts and reasoning for performing actions.
    ```json
    {
        "role": "assistant",
        "content": "Thanks, I am doing great!"
    }
    ```

The agent can decide to use tools to make actions in the real world. For example, the agent could decide to send an email to mom@mail.com with the subject "Running late, sorry!":
> <b>Tool calls</b> <br/><br/>
    Tool calls are special actions that the agent performs to solve the task.
    Here, in addition to the `role` and `content` fields (same as in the assistant message), the `tool_calls` field is a list used to represent the tool calls made by the agent.
    Each tool call is a dictionary with a `type` field, which indicates the type of tool call, and a `function` field, which is a dictionary containing the name of the function to call and its arguments.
    Arguments can be passed either as a dictionary or as a JSON string.
    ```json
    {
        "role": "assistant",
        "content": "Sending an email to your mom now.",
        "tool_calls": [
            {
                "type": "function",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "mom@mail.com",
                        "subject": "Running late, sorry!",
                    }
                }
            }
        ]
    }
    ```

After the tool calls are executed, the agent can observe the output of the tool call, e.g. "Email sent successfully.":
> <b>Tool outputs</b> <br/><br/>
    Tool outputs are the results of the tool calls. Here, the `content` field contains the output of the tool call.
    ```json
    {
        "role": "tool",
        "content": "Email sent successfully."
    }
    ```

## Datasets

A dataset is a collection of traces obtained by running an agent on a set of related tasks (e.g. coding tasks).
For instance, this is dataset containing 500 traces which result from running the OpenHands agent on SWE-Bench: [https://explorer.invariantlabs.ai/u/invariant/swe-bench--OpenHands---CodeAct-v2-1--claude-3-5-sonnet-20241022-/t/4](https://explorer.invariantlabs.ai/u/invariant/swe-bench--OpenHands---CodeAct-v2-1--claude-3-5-sonnet-20241022-/t/4). Dataset can contain its own metadata, e.g. accuracy of the agent on the dataset.