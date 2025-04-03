# Tool Calls

<!-- Semantic Tool Call Matching

At the core of agent security is the ability to match and contextualize different types of tool uses. The Invariant Policy Language supports a variety of value matching techniques, including matching against regex, content (injections, PII, toxic content), and more.

For this, so-called semantic matching is used, which allows users to precisedly match exactly the tool calls and data flows they are interested in. A semantic matching expression in the policy language looks like this:

# assuming some selected (call: ToolCall) variable
call is tool:tool_name({
    arg1: <EMAIL_ADDRESS>,
    arg2: r"[0-9]{3}-[0-9]{2}-[0-9]{4}",
    arg3: [
        "Alice",
        r"Bob|Charlie"
    ]
})
This expression evaluates to True for a ToolCall where the tool name is tool_name, and the arguments match the specified values. In this case, arg1 must be an email address, arg2 must be a date in the format XXX-XX-XXXX, and arg3 must be a list, where the first element is "Alice" and the second element is either "Bob" or "Charlie".

 Expand to see All Supported Value Matching Expressions
Overall, the following value matching expressions are supported:

Matching Personally Identifiable Information (PII)

<EMAIL_ADDRESS|LOCATION|PHONE_NUMBER|PERSON>
Matches arguments that contain an email address, location, phone number, or person name, respectively.

Example: call is tool:tool_name({arg1: <EMAIL_ADDRESS>})

Matching Regular Expressions

r"<regex>"
Matches arguments that match the specified regular expression.

Example: call is tool:tool_name({arg1: r"[0-9]{3}-[0-9]{2}-[0-9]{4}"})

Matching Content

"<constant>"
Matches arguments that are equal to the specified constant.

Example: call is tool:tool_name({arg1: "Alice"})

Matching Moderated Content

<MODERATED>
Matches arguments that contain content that has been flagged as inappropriate or toxic.

Example: call is tool:tool_name({arg1: <MODERATED>})

Matching Tool Calls

call is tool:tool_name({ ... })
Matches tool calls with the specified tool name and arguments.

Example: call is tool:tool_name

Matching Argument Objects

{ "key1": <subpattern1>, "key2": <subpattern2>, ... }
Matches an object of tool call arguments, where each argument value matches the specified subpattern.

Example: call is tool:tool_name({ arg1: "Alice", arg2: r"[0-9]{3}-[0-9]{2}-[0-9]{4}" })

Matching Lists

[ <subpattern1>, <subpattern2>, ... ]
Matches a list of tool call arguments, where each element matches the specified subpattern.

Example: call is tool:tool_name({ arg1: ["Alice", r"Bob|Charlie"] })

Wildcard Matching

call is tool({ arg1: * })
Matches any tool call with the specified tool name, regardless of the arguments. A wildcard * can be used to match any value.

Example: call is tool:tool_name({ arg1: * })

Side-Conditions

In addition to a semantic pattern, you can also specify manual checks on individual arguments by accessing them via call.function.arguments:

raise PolicyViolation("Emails should must never be sent to 'Alice'", call=call) if:
    (call: ToolCall)
    call is tool:send_email
    call.function.arguments.to == "Alice" -->


<div class='subtitle'>
Guardrail the function and tool calls of your agentic system.
</div>

At the core of any agentic systems are function and tool calls, i.e. the ability for the agent to interact with the environment via desiganted functions and tools. 

For security reasons, it is important to ensure that all tool calls an agent executes are validated and well-scoped, to prevent undesired or harmful actions. 

Guardrails provide you a powerful way to enforce such security policies, and to limit the agent's tool interface to only the tools and functions that are necessary for the task at hand.

<br/><br/>
<img src="../../assets/guardrails/tool-calls.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 400pt;"/>
<br/><br/>

<div class='risks'/>
> **Tool Calling Risks**<br/>
> Since tools are an agent's interface to interact with the world, they can also be used to perform actions that are harmful or undesired. For example, an insecure agent could:

> * Leak sensitive information, e.g. via a `send_email` function

> * Delete an important file, via a `delete_file` or a `bash` command

> * Make a payment to an attacker

> * Send a message to a user with sensitive information

To prevent tool calling related risks, Invariant offers a wide range of options to limit, constrain, validate and block tool calls. This chapter describes the different options available to you, and how to use them.

## Preventing Tool Calls

To match a specific tool call in a guardrailing rule, you can use `call is tool:<tool_name>` expressions. This allows you to only match a specific tool call, and apply guardrailing rules to it.

**Example**: Matching all `send_email` tool call
```python
raise "Must not send any emails" if:
    (call: ToolCall)
    call is tool:send_email
```

This rule will trigger for all tool calls to function `send_email`, disregarding its parameterization.

## Preventing Specific Tool Call Parameterizations

Tool calls can also be matched by their parameters. This allows you to match only tool calls with specific parameters, e.g. to block them or to restrict the tool interface exposed to the agent.

**Example**: Matching a `send_email` tool call with a specific recipient
```python
raise "Must not send any emails to Alice" if:
    (call: ToolCall)
    call is tool:send_email({
        to: "alice@mail.com"
    })
```

### Regex Matching

Similarly, you can use regex matching to match tool calls with specific parameters. This allows you to match specific tool calls with specific parameters, and apply guardrailing rules to them.

**Example**: Matching a `send_email` calls with a specific recipient domain
```python
raise "Must not send any emails to <anyone>@disallowed.com" if:
    (call: ToolCall)
    call is tool:send_email({
        to: r".*@disallowed.com"
    })
```

### Content Matching

You can also use content matching to match tool arguments with certain properties, like whether they contain personally identifiable information (PII), or whether they are flagged as toxic or inappropriate. This allows you to match specific tool calls with specific parameters, and apply guardrailing rules to them.

**Example**: Prevent `send_email` calls with phone numbers in the message body.
```python
raise "Must not send any emails to <anyone>@disallowed.com" if:
    (call: ToolCall)
    call is tool:send_email({
        body: <LOCATION>
    })
```

This type of content matching also works for other types of content, including `EMAIL_ADDRESS`, `LOCATION`, `PHONE_NUMBER`, `PERSON`, [`MODERATED`](./moderation.md).

**Tool Patterns** In the expression `call is tool:send_email({body: <LOCATION>})`, only the `body` argument is checked, whereas the other arguments are not required to match. This allows you to only check certain arguments of a tool call, and not all of them.

Alternatively, you can also directly use `invariant.detectors.pii` on the tool call arguments like so:

```python
from invariant.detectors import pii

raise "Must not send any emails to <anyone>@disallowed.com" if:
    (call: ToolCall)
    # filter for right tool
    call is tool:send_email
    # filter for content
    "LOCATION" in pii(call.function.arguments.body)
```

## Checking Tool Outputs

Similar to tool calls, you can check and validate tool outputs.

**Example**: Raise an error if PII is detected in the tool output
```python
raise "PII in tool output" if:
    (out: ToolOutput)
    len(pii(out.content)) > 0
```

### Checking only certain tool outputs

You can also check only certain tool outputs, e.g. to only check the output of a specific tool call.

**Example**: Raise an error if PII is detected in the tool output
```python
from invariant.detectors import moderated

raise "Moderated content in tool output" if:
    (out: ToolOutput)
    out is tool:read_website
    moderated(out.content)
```

Here, only if the `read_website` tool call returns moderated content, the rule will trigger. This allows you to only check certain tool outputs, and not all of them.


## Checking classes of tool calls

To limit your guardrailing rule to a list of different tools, you can also access a tool's name directly:

**Example**: Raise an error if any of the banned tools is used.
```python
raise "Banned tool used" if:
    (call: ToolCall)
    call.function.name in ["send_email", "delete_file"]
```

This allows you to limit your guardrailing rule to a list of different tools (e.g. all sensitive tools).