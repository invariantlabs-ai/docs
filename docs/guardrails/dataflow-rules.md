---
title: Dataflow Rules
description: Secure the dataflow of your agentic system, to ensure that sensitive data never leaves the system through unintended channels.
---

# Dataflow Rules

<div class='subtitle'>
Secure the dataflow of your agentic system, to ensure that sensitive data never leaves the system through unintended channels.
</div>

Due to their dynamic nature, agentic systems often mix and combine data from different sources, and can easily leak sensitive information. Guardrails provides a simple way to define dataflow rules, to ensure that sensitive data never leaves the system through unintended channels.

For instance, your agent may access an internal source of information like a database or API, and then attempt to send an email to an untrusted recipient (see below).

<br/><br/>
<img src="site:assets/guardrails/dataflow.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 400pt;"/>
<br/><br/>

Invariant allows you to detect such contextually sensitive dataflow, and prevent it from happening.

This chapter discusses how Invariant Guardrails can be used to secure agentic dataflow and make sure that sensitive data never leaves the system through unintended channels.

<div class='risks'/>
> **Dataflow Risks**<br/>

> Due to their dynamic nature, agentic systems often mix and combine data from different sources, and can easily leak sensitive information. For example, an insecure agent could:

> * Leak sensitive information, such as **API keys or passwords**, to an external service.

> * Send sensitive information, such as **user data or PII**, to an external service.

> * Be prompt-injected by an external service via indirect channels, to **perform malicious actions** as injected by a potential attacker.

## The Flow Operator `->`

<img src="site:/guardrails/flow.svg" alt="Flow Operator" class="flow-operator" style="display: block; margin: 40pt auto; width: 100%; max-width: 400pt;"/>

At the center of Invariant's data flow checking is the flow operator `->`. This operator enables you to precisely detect flows and the ordering of operations in an agent trace.

For example, to prevent a user message with the content `"send"` from triggering a `send_email` tool call, you can use the following rule.

**Example:** Preventing a simple flow.
```guardrail
raise "Must not call tool after user uses keyword" if:
    (msg: Message) -> (tool: ToolCall)
    msg.role == "user"
    "send" in msg.content
    tool is tool:send_email
```
```example-trace
[
  {
    "role": "user",
    "content": "Can you send this email to Peter?"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "send_email",
      "arguments": {
        "contents": "Hi Peter, here is what can be found in the internal document: ..."
      }
    }
  }
]
```

Evaluating this rule will highlight both the relevant part of the user message and the subsequent `send_email` call:

<img src="site:/guardrails/flow.png" alt="Flow Operator" class="flow-operator" style="display: block; margin: 0 auto; width: 100%; max-width: 500pt;"/>

This rule will raise an error on the given trace because a user message with the content `"send"` is followed by a `send_email` tool call, and thus makes it impossible to send an email after the user uses the keyword `"send"`.

Here, the line `(msg: Message) -> (tool: ToolCall)` specifies that the rule only applies, when a `Message` is followed by a `ToolCall`, where `msg` and `tool` are further constrained by the extra conditions in the following lines.

## Multi-Turn Flows

<img src="site:/guardrails/multi-turn-flow.svg" alt="Flow Operator" class="flow-operator" style="display: block; margin: 40pt auto; width: 100%; max-width: 400pt;"/>

You can also specify multi-turn flows, e.g. to match when a message is followed by a tool call and then a tool output. For example, to raise an error if a user message with the content `"send"` is followed by a `send_email` tool call, and this tool's output contains the name `"Peter"`, you can use the following rule:

**Example:** Preventing a multi-turn flow
```guardrail
raise "Must not call tool after user uses keyword" if:
    (msg: Message) -> (tool: ToolCall)
    tool -> (output: ToolOutput)
    
    # message is from user and contains keyword
    msg.role == "user"
    "send" in msg.content
    
    # tool call is to send_email
    tool is tool:send_email
    
    # result contains keyword
    "Peter" in output.content
```
```example-trace
[
  {
    "role": "user",
    "content": "Can you send this email to Peter?"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "send_email",
      "arguments": {
        "contents": "Hi Peter, here is what can be found in the internal document: ..."
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "1",
    "content": "Email sent to Peter"
]
```

Note that for this you have to use the  `->` operator twice, in separate lines, to express the transitive connection between `msg`, `tool`, and `tool2`.

## Direct Succession Flows `~>`

<img src="site:/guardrails/direct-flow.svg" alt="Flow Operator" class="flow-operator" style="display: block; margin: 40pt auto; width: 100%; max-width: 400pt;"/>

Next to the `->` operator, which specifies any-distance flows, i.e. flows with any number of steps in between, Invariant also provides the `~>` operator, which specifies direct succession flows, i.e. flows of length 1.

This is helpful, to only look at directly succeeding messages, e.g. to inspect the immediate output of a tool and its corresponding call:

**Example:** Preventing a tool call output of a specific type
```guardrail
raise "Must not call tool after user uses keyword" if:
    # directly succeeding (ToolCall, ToolOutput) pair
    (call: ToolCall) ~> (output: ToolOutput)
    
    # calls is sending an email
    call is tool:send_email
    
    # result contains keyword
    "Peter" in output.content
```
```example-trace
[
  {
    "role": "user",
    "content": "Can you send this email to Peter?"
  },
  {
    "role": "assistant",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "send_email",
          "arguments": {
            "contents": "Hi Peter, here is what can be found in the internal document: ..."
          }
        }
      }
    ]
  },
  {
    "role": "tool",
    "tool_call_id": "1",
    "content": "Email sent to Peter"
  }
]
```

Note that here, our rule will only match, if the `ToolOutput` is a direct successor of the `ToolCall`, i.e. if there is no other message in between (e.g. no extra user or assistant message).

In a trace, this looks like this:

```json
[
  ...
  {"role": "assistant", "tool_calls": [
    {
      "id": "1",
      "type": "function",
      "function": {
        "name": "send_email",
        "arguments": {
          "contents": "Hi Peter, here is what can be found in the internal document: ..."
        }
      }
    }
  ]},
  {"role": "tool", "tool_call_id": "1", "content": "Email sent to Peter"}
  ...
]
```

Here, the `ToolOutput` is a direct successor of the `ToolCall`, and thus the rule will match.

## Combining Content Guardrails with Dataflow Rules

Naturally, the `->` operator can also be combined with content guardrails, to specify more complex rules. 

For example, to prevent an agent from leaking data externally, when API keys are in context, you can use the following rule:

**Example:** Preventing sensitive information like API keys from leaking externally.
```guardrail
from invariant.detectors import secrets

raise "Must not call tool after user uses keyword" if:
    (msg: Message) -> (tool: ToolCall)
    
    # message contains sensitive keys
    len(secrets(msg.content)) > 0

    # agent attempts to use externally facing action
    tool.function.name in ["create_pr", "add_comment"]
```
```example-trace
[
  {
    "role": "user",
    "content": "My GitHub token is ghp_1234567890123456789012345678901234567890"
  },
  {
    "role": "assistant",
    "content": "[agent reasoning...]"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "create_pr",
      "arguments": {
        "contents": "This PR checks in a sensitive API key"
      }
    }
  }
]
```

## Loop Detection

Next to data flow, the flow operators can also be used to detect looping patterns in agent behavior. To learn more about this, check out the [loop detection chapter](./loops.md).