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
```python
from invariant.detectors import copyright

raise "found copyrighted code" if:
    (msg: Message)
    not empty(copyright(msg.content, threshold=0.75))
```
<div class="code-caption">{little text bit}</div>
