---
title: Copyrighted Content
---

# Copyrighted Content
<div class='subtitle'>
{subheading}
</div>

{introduction}
<div class='risks'/> 
> **Copyrighted Content Risks**<br/> 
> Without safeguards, agents may: 

> * {reasons}

{bridge}

## copyright <span class="detector-badge"></span>
```python
def copyright(
    data: Union[str, List[str]],
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
```guardrail
from invariant.detectors import copyright

raise "found copyrighted code" if:
    (msg: Message)
    not empty(copyright(msg.content, threshold=0.75))
```
```example-trace
[
  {
    "role": "assistant",
    "content": "/**\n* GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007\n*/\nexport const someConst = false;"
  }
]
```
<div class="code-caption">{little text bit}</div>
