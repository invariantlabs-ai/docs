---
title: PII Detection
description: Detect and manage PII in traces.
---

# PII Detection
<div class='subtitle'>
Detect and manage PII in traces.
</div>

Personally Identifiable Information (PII) refers to sensitive information — like names, emails, or credit card numbers — that AI systems and agents need to handle carefully. When these systems work with user data, it is important to establish clear rules about how personal information can be handled, to ensure the sytem functions safely.

<div class='risks'/> 
> **PII Risks**<br/> 
> Without safeguards, agents may: 

> * **Log PII** in traces or internal tools 
>
> * **Expose PII** to in unintentional or dangerous ways
>
> * **Share PII** in responses or external tool calls

The `pii` function helps prevent these issues by scanning messages for PII, thus acting as a safeguard that lets you detect and block sensitive data before it’s stored, surfaced, or shared.

## pii <span class="detector-badge"/>
```python
def pii(
    data: Union[str, List[str]],
    entities: Optional[List[str]]
) -> List[str]
```
Detector to find personally-identifiable information in text.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single message or a list of messages to detect PII in. |
| `entities`  | `Optional[List[str]]`   | A list of [PII entity types](https://microsoft.github.io/presidio/supported_entities/) to detect. Defaults to detecting all types. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` | A list of all the detected PII in `data` |

### Detecting PII
The simplest usage of the `pii` function is to check against any message. The following example will raise an error if any message in the trace contains PII.

**Example:** Detecting any PII in any message.
```guardrail
from invariant.detectors import pii

raise "Found PII in message" if:
    (msg: Message)
    any(pii(msg))
```
```example-trace
[
  {
    "role": "user",
    "content": "Summarize the meeting_notes.txt and send them to Alice via e-mail"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "read",
      "arguments": {
        "file": "meeting_notes.txt"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "1",
    "content": "Meeting notes: The meeting was held on 2024-01-01 at 10:00 AM. The attendees from our company were Alice, Bob and Charlie. The topic was the new project proposal for the client BankOfEurope Inc. Client was represented by Lily Warren (contact: lily@bankofeurope.eu). The amount of the contract should be 20M USD. The credit card number of Alice is 378282246310005."
  },
  {
    "id": "2",
    "type": "function",
    "function": {
      "name": "find_contact",
      "arguments": {
        "text": "Alice"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "2",
    "content": "alice@gmail.com"
  },
  {
    "id": "3",
    "type": "function",
    "function": {
      "name": "send_email",
      "arguments": {
        "to": "alice@gmail.com",
        "text": "The meeting between our company and BankOfEurope Inc. (represented by Lily Warren) discussed a new proposal."
      }
    }
  }
]
```
<div class="code-caption"> Any PII in the text of the trace will raise an error. </div>


### Detecting Specific PII Types
You can also specify specific types of PII that you would like to detect, such as phone numbers, emails, or credit card information. The example below demonstrates how to detect credit card numbers in Messages.

**Example:** Detecting Credit Card Numbers.
```guardrail
from invariant.detectors import pii

raise "Found Credit Card information in message" if:
    (msg: ToolOutput)
    any(pii(msg, ["CREDIT_CARD"]))

```
```example-trace
[
  {
    "role": "user",
    "content": "Summarize the meeting_notes.txt and send them to Alice via e-mail"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "read",
      "arguments": {
        "file": "meeting_notes.txt"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "1",
    "content": "Meeting notes: The meeting was held on 2024-01-01 at 10:00 AM. The attendees from our company were Alice, Bob and Charlie. The topic was the new project proposal for the client BankOfEurope Inc. Client was represented by Lily Warren (contact: lily@bankofeurope.com). The amount of the contract should be 20M USD. The credit card number of Alice is 378282246310005."
  },
  {
    "id": "2",
    "type": "function",
    "function": {
      "name": "find_contact",
      "arguments": {
        "text": "Alice"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "2",
    "content": "alice@gmail.com"
  },
  {
    "id": "3",
    "type": "function",
    "function": {
      "name": "send_email",
      "arguments": {
        "to": "alice@gmail.com",
        "text": "The meeting between our company and BankOfEurope Inc. (represented by Lily Warren) discussed a new proposal."
      }
    }
  }
]
```
<div class="code-caption"> Only messages containing credit card numbers will raise an error. </div>


### Preventing PII Leakage
It is also possible to use the `pii` function in combination with other filters to get more complex behaviour. The example below shows how you can detect when an agent attempts to send emails outside of your organisation. 

**Example:** Detecting PII Leakage in External Communications.
```guardrail
from invariant.detectors import pii

raise "Attempted to send PII in an email" if:
    (out: ToolOutput) -> (call: ToolCall)
    any(pii(out.content))
    call is tool:send_email({ to: "^(?!.*@ourcompany.com$).*$" }) 
```
```example-trace
[
  {
    "role": "user",
    "content": "Summarize the meeting_notes.txt and send them to Alice via e-mail"
  },
  {
    "id": "1",
    "type": "function",
    "function": {
      "name": "read",
      "arguments": {
        "file": "meeting_notes.txt"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "1",
    "content": "Meeting notes: The meeting was held on 2024-01-01 at 10:00 AM. The attendees from our company were Alice, Bob and Charlie. The topic was the new project proposal for the client BankOfEurope Inc. Client was represented by Lily Warren (contact: lily@bankofeurope.eu). The amount of the contract should be 20M USD. The credit card number of Alice is 378282246310005."
  },
  {
    "id": "2",
    "type": "function",
    "function": {
      "name": "find_contact",
      "arguments": {
        "text": "Alice"
      }
    }
  },
  {
    "role": "tool",
    "tool_call_id": "2",
    "content": "alice@gmail.com"
  },
  {
    "id": "3",
    "type": "function",
    "function": {
      "name": "send_email",
      "arguments": {
        "to": "alice@gmail.com",
        "text": "The meeting between our company and BankOfEurope Inc. (represented by Lily Warren) discussed a new proposal."
      }
    }
  }
]
```
<div class="code-caption"> Explicitly prevent sending emails with PII to non-company email domains. </div>

