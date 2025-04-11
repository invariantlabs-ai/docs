# Moderated and Toxic Content
<div class='subtitle'>
{subheading}
</div>

{introduction}
<div class='risks'/> 
> **Moderated and Toxic Content Risks**<br/> 
> Without safeguards, agents may: 

> * {reasons}

{bridge}

## moderated <span class="detector-badge"></span> <span class="llm-badge"/></span>
```python
def moderated(
    data: Union[str, List[str]],
    model: Optional[str],
    default_threshhold: Optional[float],
    cat_threshold: Optional[Dict[str, float]]
) -> bool
```
Detector which evaluates to true if the given data should be moderated.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single message or a list of messages to detect prompt injections in. |
| `model`     | `Union[str, List[str]]` |  The model to use for moderation detection. |
| `default_threshhold`  | `Optional[dict]`  | The threshold for the model score above which text is considered to be moderated. |
| `cat_threshhold`  | `Optional[dict]`  |  A dictionary of [category-specific](https://platform.openai.com/docs/guides/moderation#quickstart) thresholds. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `bool` | <span class='boolean-value-true'>TRUE</span> if a prompt injection was detected, <span class='boolean-value-false'>FALSE</span> otherwise |

### Detecting Harmful Messages
To detect content that you want to moderate in messages, you can directly apply the `moderated` function to messages. 

**Example:** Harmful Message Detection
```python
from invariant.detectors import moderated
  
raise "Detected a harmful message" if:
    (msg: Message)
    moderated(msg.content)
```
<div class="code-caption">Default moderation detection.</div>


### Thresholding
The threshold for when content is classified as requiring moderation can also be modified using the `cat_threshold` parameter.

**Example:** Thresholding Detection
```python
from invariant.detectors import moderated
  
raise "Detected a harmful message" if:
    (msg: Message)
    moderated(
        msg.content,
        cat_thresholds={"hate/threatening": 0.15}
    )
```
<div class="code-caption">Thresholding for a specific category.</div>