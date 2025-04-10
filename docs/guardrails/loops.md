
# Loop Detection

<div class='subtitle'>
Detect and prevent infinite loops in your agentic system.
</div>

Loop detection is a critical component of any agentic system, as it helps to prevent infinite loops and other undesired behavior. Guardrails provides a simple way to detect and prevent loops in your agentic system.

<div class='risks'/>
> **Looping Risks**<br/>
> Loops are a common source of bugs and errors in agentic systems. For example, an agent can:

> * Get stuck in an infinite loop, **consuming resources and causing the system to crash**

> * Get stuck in a loop that causes it to **perform an irreversible action**, such as sending a message many times

> * Get stuck in a loop, requiring **many expensive LLM calls**, causing the system to run out of tokens or money

To prevent looping in agents, Guardrails offers multi-turn pattern detection in its rule engine. This allows you to detect and prevent loops in your agentic system, and to take action when a loop is detected.

## Limiting Number of Uses for Certain Operations

In some cases, you may want to limit the number of times an agent can use a tool.

For example, you may just want to limit the total number of times an agent can use a tool, regardless of the order in which the tool is called.

You can do this also by using the `count` quantifier:

```guardrail
from invariant import count

raise "Allocated too many virtual machines" if:
    count(min=3):
        (call: ToolCall)
        call is tool:allocate_virtual_machine
```

```example-trace
[
  {
    "role": "user",
    "content": "Let's setup a new environment"
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "allocate_virtual_machine",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "tool",
    "content": "Virtual machine allocated successfully"
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "allocate_virtual_machine",
          "arguments": {}
        }
      },
      {
        "id": "2",
        "type": "function",
        "function": {
          "name": "allocate_virtual_machine",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "tool",
    "content": "Virtual machine allocated successfully"
  }
]
```

## Retry Loops

One example of looping behavior is when an agent retries a tool call multiple times without any change in the input or output. 

To detect this, you can write multi-turn guardrailing rules, that match the repetition of a tool call:

**Example**: Detecting a retry loop for `check_status`:

```guardrail
raise "3 retries of check_status" if:
    # identifies tool call patterns call1 -> call2 -> call3
    (call1: ToolCall) -> (call2: ToolCall)
    call2 -> (call3: ToolCall)
    
    # ensures all are to the same tool
    call1 is tool:check_status
    call2 is tool:check_status
    call3 is tool:check_status
```

```example-trace
[
  {
    "role": "user",
    "content": "Reply to Peter's message"
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "assistant",
    "content": "There seems to be an issue with the server. I will check the status and get back to you."
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  }
]
```

## Detecting Loops with Quantifiers

In addition to detecting looping patterns of static length, you can also write more dynamic rules using quantifiers.

For example, you can use the `count` quantifier, to check for looping patterns:

```guardrail
from invariant import count

raise "Repetition of length in [2,10]" if:
    # start with any check_status tool call
    (call1: ToolCall)
    call1 is tool:check_status
    
    # there need to be between 2 and 10 other
    # calls to the same tool, after 'call1'
    count(min=2, max=10):
        call1 -> (other_call: ToolCall)
        other_call is tool:check_status
```

```example-trace
[
  {
    "role": "user",
    "content": "Reply to Peter's message"
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "assistant",
    "content": "There seems to be an issue with the server. I will check the status and get back to you."
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  },
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "1",
        "type": "function",
        "function": {
          "name": "check_status",
          "arguments": {}
        }
      }
    ]
  }
]
```

This rule only triggers, if there are at least 3 consecutive calls (one initial call and two subsequent calls) to the `check_status` tool. The rule will not trigger if there are only 2 calls, or if there are more than 10 calls.

This rule uses the  _count_ quantifier, which means for this rule to match, the conditions in the `count(...):` block must be satisfied for at least 2 and at most 10 different assignments for `other_call`.