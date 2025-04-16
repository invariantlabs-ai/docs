---
title: Moderated and Toxic Content
---

# Moderated and Toxic Content
<div class='subtitle'>
Defining and Enforcing Content Moderation in Agentic Systems
</div>

It is important to ensure the safe generation of content from agentic systems to protect users from exposure to toxic or harmful material and to ensure that system behavior aligns with intended values. Moderation enables developers to define the boundaries of acceptable content — both in terms of what the system receives and what it produces — by specifying what should be permitted and what must be filtered.

By implementing moderation guardrails, you can shape the behavior of agentic systems in a way that is predictable, value-aligned, and resilient to misuse.
<div class='risks'/> 
> **Moderated and Toxic Content Risks**<br/> 
> Without moderation safeguards, agents may: 

> * Generate or amplify **hate speech, harassment, or explicit content**.

> * Act on inappropriate user inputs causing **unintended behavoiour**.

> * **Spread misinformation** or reinforce harmful stereotypes.


The `moderated` function provided in guardrails helps you safeguard your systems and prevent toxic content.

## moderated <span class="detector-badge"></span> <span class="llm-badge"/></span>
```python
def moderated(
    data: str | list[str],
    model: str | None = None,
    default_threshhold: float | None = 0.5,
    cat_threshold: dict[str, float] | None = None
) -> bool
```
Detector which evaluates to true if the given data should be moderated.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `str | list[str]` | A single message or a list of messages. |
| `model`     | `str | list[str]` |  The model to use for moderation detection (`KoalaAI/Text-Moderation` or `openai` for the OpenAI [Moderations API](https://platform.openai.com/docs/guides/moderation)). |
| `default_threshhold`  | `float | None`  | The threshold for the model score above which text is considered to be moderated. |
| `cat_threshhold`  | `dict[str, float] | None`  |  A dictionary of [category-specific](https://platform.openai.com/docs/guides/moderation#quickstart) thresholds. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `bool` | <span class='boolean-value-true'>TRUE</span> if a prompt injection was detected, <span class='boolean-value-false'>FALSE</span> otherwise |

### Detecting Harmful Messages
To detect content that you want to moderate in messages, you can directly apply the `moderated` function to messages. 

**Example:** Harmful Message Detection
```guardrail
from invariant.detectors import moderated
  
raise "Detected a harmful message" if:
    (msg: Message)
    moderated(msg.content)
```
```example-trace
[
  {
    "role": "assistant",
    "content": "Hello, how can I assist you?"
  },
  {
    "role": "user",
    "content": "This is hatefully hateful hate!"
  }
]
```
<div class="code-caption">Default moderation detection.</div>


### Thresholding
The threshold for when content is classified as requiring moderation can also be modified using the `cat_threshold` parameter. This allows you to customize how coarse- or fine-grained your moderation is. The default is `0.5`.

**Example:** Thresholding Detection
```guardrail
from invariant.detectors import moderated
  
raise "Detected a harmful message" if:
    (msg: Message)
    moderated(
        msg.content,
        cat_thresholds={"hate/threatening": 0.15}
    )
```
```example-trace
[
  {
    "role": "assistant",
    "content": "Hello, how can I assist you?"
  },
  {
    "role": "user",
    "content": "This is hatefully hateful hate!"
  }
]
```
<div class="code-caption">Thresholding for a specific category.</div>
