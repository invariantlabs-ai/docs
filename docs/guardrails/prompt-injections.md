# Jailbreaks and Prompt Injections
<div class='subtitle'>
{subheading}
</div>

{introduction}
<div class='risks'/> 
> **Jailbreak and Prompt Injection Risks**<br/> 
> Without safeguards, agents may: 

> * {reasons}

{bridge}

## prompt_injection <span class="detector-badge"/>
```python
def prompt_injection(
    data: Union[str, List[str]],
    config: Optional[dict] = None
) -> bool
```
Detector to find prompt injections in text.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single message or a list of messages to detect prompt injections in. |
| `entities`  | `Optional[dict]`   | A list of [PII entity types](https://microsoft.github.io/presidio/supported_entities/) to detect. Defaults to detecting all types. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `bool` | <span class='boolean-value-true'>TRUE</span> if a prompt injection was detected, <span class='boolean-value-false'>FALSE</span> otherwise |

### Detecting Prompt Injections

**Example:** Indirect Prompt Injection Detection.
```python
from invariant.detectors import prompt_injection

raise "detected an indirect prompt injection before send_email" if:
    (out: ToolOutput) -> (call: ToolCall)
    prompt_injection(out.content) 
    call is tool:send_email({ to: "^(?!.*@ourcompany.com$).*$" })
```
<div class="code-caption"> {little description}</div>


## unicode <span class="detector-badge"/>
```python
def unicode(
    data: Union[str, List[str]],
    categories: Optional[list] = None
) -> bool
```
Detector to find specific types of unicode characters in text.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single message or a list of messages to detect prompt injections in. |
| `categories`  | `Optional[List[str]]`   | A list of [unicode categories](https://en.wikipedia.org/wiki/Unicode_character_property#General_Category) to detect. Defaults to detecting all. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` | The list of detected classes, for example `["Sm", "Ll", ...]` |

### Detecting Specific Unicode Characters

**Example:** Detecting Math Characters.
```python
from invariant.detectors import unicode

raise "Found Math Symbols in message" if:
    (msg: Message)
    any(unicode(msg), ["Sm"])
```
<div class="code-caption"> {little description}</div>
