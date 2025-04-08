# PII Detection
<div class='subtitle'>
Detect and manage PII in traces.
</div>

Personally Identifiable Information (PII) refers to sensitive information — like names, emails, or credit card numbers — whether intentionally or not. If not properly handled, this data can be exposed in logs, traces, or external communications, leading to privacy violations, regulatory risks, or user harm.

<div class='risks'/> 
> **PII Risks**<br/> 
> Without safeguards, agents may: 

> * Log PII in traces or internal tools 
> * Share PII in responses or external tool calls

The `pii` function helps prevent these issues by scanning messages for PII, thus acting as a safeguard that lets you detect and block sensitive data before it’s stored, surfaced, or shared.

## pii <span class="detector-badge"/>
```python
def pii(
    data: Union[str, List[str]],
    entities: Optional[List[str]] = None
) -> List[str]
```
Detector to find personally indentifaible information in text.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single message or a list of messages to detect PII in |
| `entities`  | `Optional[List[str]]`   | A list of [PII entity types](https://microsoft.github.io/presidio/supported_entities/) to detect. Defaults to detecting all types. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` | A list of all the detected PII in `data` |

### Detecting PII
The simplest usage of the `pii` function is to check against any message. The following example will raise an error if any message in the trace contains PII.

**Example:** Detecting any PII in any message.
``` py
from invariant.detectors import pii

raise "Found PII in message" if:
    (msg: Message)
    any(pii(msg))
```
<div class="code-caption"> Any PII in the text of the trace will raise an error. </div>


### Detecting Specific PII Types
You can also specify specific types of PII that you would like to detect, such as phone numbers, emails, or credit card information. The example below demonstrates how to detect credit card numbers in Messages.

**Example:** Detecting Credit Card Numbers.
```guardrail
from invariant.detectors import pii

raise "Found PII in message" if:
    (msg: Message)
    any(pii(msg, ["CREDIT_CARD"]))
```
<div class="code-caption"> Only messages containing credit card numbers will raise an error. </div>


### Preventing PII leakage
It is also possible to use the `pii` function in combination with other filters to get more complex behaviour. The example below shows how you can detect when an agent attempts to send emails outside of your organisation. 

**Example:** Detecting PII Leakage in External Communications.
```python
from invariant.detectors import pii

raise "Attempted to send PII in an email" if:
    (out: ToolOutput) -> (call: ToolCall)
    any(pii(out.content))
    call is tool:send_email({ to: "^(?!.*@ourcompany.com$).*$" }) 
```
<div class="code-caption"> Explicitly prevent sending emails with PII to non-company email domains. </div>

