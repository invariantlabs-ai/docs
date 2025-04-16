---
title: Tool Calls
description: Guardrail the function and tool calls of your agentic system.
---

# Tool Calls

<div class='subtitle'>
Guardrail the function and tool calls of your agentic system.
</div>

At the core of any agentic system are function and tool calls, i.e. the ability for the agent to interact with the environment via designated functions and tools. 

For security reasons, it is important to ensure that all tool calls an agent executes are validated and well-scoped, to prevent undesired or harmful actions. 

Guardrails provide you with a powerful way to enforce such security policies and to limit the agent's tool interface to only the tools and functions that are necessary for the task at hand.

<br/><br/>
<img src="site:assets/guardrails/tool-calls.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 400pt;"/>
<br/><br/>

!!! danger "Tool Calling Risk"
    Since tools are an agent's interface to interact with the world, they can also be used to perform actions that are harmful or undesired. For example, an insecure agent could:

    * Leak sensitive information, e.g. via a `send_email` function.

    * Delete an important file, via a `delete_file` or a `bash` command.

    * Make a payment to an attacker.

    * Send a message to a user with sensitive information.

To prevent tool-call-related risks, Invariant offers a wide range of options to limit, constrain, validate, and block tool calls. This chapter describes the different options available to you, and how to use them.

## Preventing Tool Calls

To match a specific tool call in a guardrailing rule, you can use `call is tool:<tool_name>` expressions. This allows you to only match a specific tool call, and apply guardrailing rules to it.

**Example**: Matching all `send_email` tool calls.
```guardrail
raise "Must not send any emails" if:
    (call: ToolCall)
    call is tool:send_email
```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@mail.com"
                    }
                }
            }
        ]
    }
]
```

This rule will trigger for all tool calls to the function `send_email`, disregarding its parameterization.

## Preventing Specific Tool Call Parameterizations

Tool calls can also be matched by their parameters. This allows you to match only tool calls with specific parameters, e.g. to block them or to restrict the tool interface exposed to the agent.

**Example**: Matching a `send_email` tool call with a specific recipient.
```guardrail
raise "Must not send any emails to Alice" if:
    (call: ToolCall)
    call is tool:send_email({
        to: "alice@mail.com"
    })
```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@mail.com"
                    }
                }
            }
        ]
    }
]
```

### Regex Matching

Similarly, you can use regex matching to match tool calls with specific parameters. This allows you to match specific tool calls with specific parameters, and apply guardrailing rules to them.

**Example**: Matching a `send_email` calls with a specific recipient domain.
```guardrail
raise "Must not send any emails to <anyone>@disallowed.com" if:
    (call: ToolCall)
    call is tool:send_email({
        to: r".*@disallowed.com"
    })
```
```example-trace
[
    {
        "role": "user",
        "content": "Send two emails, one to alice@disallowed.com and one to bob@allowed.com"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@disallowed.com"
                    }
                }
            },
            {
                "type": "function",
                "id": "2",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "bob@allowed.com"
                    }
                }
            }
        ]
    }
]
```
### Content Matching

You can also use content matching to match tool arguments with certain properties, like whether they contain personally identifiable information (PII), or whether they are flagged as toxic or inappropriate. This allows you to match specific tool calls with specific parameters, and apply guardrailing rules to them.

**Example**: Prevent `send_email` calls with locations in the message body.
```guardrail
raise "Must not send any emails with locations" if:
    (call: ToolCall)
    call is tool:send_email({
        body: <LOCATION>
    })
```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com, and tell her to meet at Rennweg 107, Zurich"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@mail.com",
                        "body": "Let's meet at Rennweg 107, Zurich"
                    }
                }
            }
        ]
    }
]
```

This type of content matching also works for other types of content, including `EMAIL_ADDRESS`, `LOCATION`, `PHONE_NUMBER`, `PERSON`, [`MODERATED`](./moderation.md).

**Tool Patterns** In the expression `call is tool:send_email({body: <LOCATION>})`, only the `body` argument is checked, whereas the other arguments are not required to match. This allows you to check only certain arguments of a tool call and not all of them.

Alternatively, you can also directly use `invariant.detectors.pii` on the tool call arguments like so:

```guardrail
from invariant.detectors import pii

raise "Must not send any emails to <anyone>@disallowed.com" if:
    (call: ToolCall)
    # filter for the right tool
    call is tool:send_email
    # filter content
    "LOCATION" in pii(call.function.arguments.body)
```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com, and tell her to meet at Rennweg 107, Zurich"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@mail.com",
                        "body": "Let's meet at Rennweg 107, Zurich"
                    }
                }
            }
        ]
    }
]
```
## Checking Tool Outputs

Similar to tool calls, you can check and validate tool outputs.

**Example**: Raise an error if PII is detected in the tool output.
```guardrail
from invariant.detectors import pii

raise "PII in tool output" if:
    (out: ToolOutput)
    len(pii(out.content)) > 0

```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com, and tell her to meet at Rennweg 107, Zurich"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "get_inbox",
                    "arguments": {}
                }
            }
        ]
    },
    {
        "role": "tool",
        "content": "Here is your inbox:\n - From Bob: 'Let's meet at Rennweg 107, Zurich at 10am and also invite Bob Müller'"
    }
]
```

### Checking only certain tool outputs

You can also choose to check only specific tool outputs. For example, you may wish to check only a specific subset of the `ToolOutput` types.

**Example**: Raise an error if PII is detected in the tool output of the `read_website` tool.
```guardrail
from invariant.detectors import moderated

raise "Moderated content in tool output" if:
    (out: ToolOutput)
    out is tool:read_website
    moderated(out.content, cat_thresholds={"hate/threatening": 0.1})
```
```example-trace
[
    {
        "role": "user",
        "content": "Read the website https://www.disallowed.com"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "read_website",
                    "arguments": {}
                }
            }
        ]
    },
    {
        "role": "tool",
        "tool_call_id": "1",
        "content": "I will attack you"
    }
]
```

This rule will trigger only if the `read_website` tool is specifically called *and* its output contains content that warrants moderation.


## Checking classes of tool calls

To limit your guardrailing rule to a list of different tools, you can also access a tool's name directly.

**Example**: Raise an error if any of the banned tools are used.
```guardrail
raise "Banned tool used" if:
    (call: ToolCall)
    call.function.name in ["send_email", "delete_file"]
```
```example-trace
[
    {
        "role": "user",
        "content": "Send an email to alice@mail.com, then read the current directory and delete the file 'important.txt'"
    },
    {
        "role": "assistant",
        "content": "I'm on it.",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "send_email",
                    "arguments": {
                        "to": "alice@mail.com",
                        "body": "Let's meet at Rennweg 107, Zurich at 10am and also invite Bob Müller"
                    }
                }
            },
            {
                "type": "function",
                "id": "2",
                "function": {
                    "name": "read_directory",
                    "arguments": {}
                }
            },
            {
                "type": "function",
                "id": "3",
                "function": {
                    "name": "delete_file",
                    "arguments": {
                        "path": "important.txt"
                    }
                }
            }
        ]
    }
]
```

This allows you to limit your guardrailing rule to a list of different tools (e.g. all sensitive tools).