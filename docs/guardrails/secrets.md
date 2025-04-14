---
title: Secret Tokens and Credentials
---

# Secret Tokens and Credentials
<div class='subtitle'>
{subheading}
</div>

{introduction}
<div class='risks'/> 
> **Secret Tokens and Credentials Risks**<br/> 
> Without safeguards, agents may: 

> * {reasons}

{bridge}

## secrets <span class="detector-badge"></span>
```python
def secrets(
    data: Union[str, List[str]]
) -> List[str]
```
Detects potentially copyrighted material in the given `data`.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` |  A single message or a list of messages. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` |  List of detected copyright types. For example, `["GNU_AGPL_V3", "MIT_LICENSE", ...]`|

### Detecting Copyrighted content

**Example:** Detecting Copyrighted content
```python
from invariant.detectors import secrets

raise "Found Secrets" if:
    (msg: Message)
    any(secrets(msg))
```
<div class="code-caption">{little text bit}</div>
