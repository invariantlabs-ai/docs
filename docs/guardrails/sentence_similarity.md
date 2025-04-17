---
title: Sentence Similarity
description: Detect semantically similar sentences.
---

# Sentence similarity
<div class='subtitle'>
Detect semantically similar sentences.
</div>

Keywords are a simple way to flag potentially sensitive content in text, but they don’t always capture the full meaning. In cases where you need a deeper understanding of the content, semantic similarity is more effective. 

`is_similar` provides fuzzy matching between strings using sentence embedding models to detect whether two pieces of text are semantically alike.


## is_similar
```python
def is_similar(
    data: str | list[str],
    target: str | list[str],
    threshold: float | Literal["might_resemble", "same_topic", "very_similar"] = "might_resemble",
) -> bool:
```
Checks if data is sufficiently similar to target.
**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `str | list[str]` | text to analyze. |
| `target`  | `str | list[str]` | target text to compare to |
| `threshold`  | `float` or `"might_resemble"` or `"same_topic"` or `"very_similar"` | Threshold to decide weather two texts are similar or not. Three default values are available, otherwise `float`.  |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `bool` | Returns `True` if at least one data string is sufficiently similar to at least one target string, based on the threshold. |

### Detect Topic
A sample usage of `is_similar`, could be topic detection. For instance, let's say our employees tend to talk a lot about cats. However, we would like this to stay confidential. No emails about cats should be sent.

**Example:** Detect emails about cats.
```guardrail
from invariant.detectors import is_similar

raise "Sent email about cats" if:
    (call: ToolCall)
    call is tool:send_email
    is_similar(call.function.arguments.body, "cats", threshold="might_resemble")
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
    "content": "Meeting notes: The meeting was held on 2024-01-01 at 10:00 AM. The attendees from our company were Alice, Bob and Charlie. We talked about our cats. We all love cats, but couldn't decide on which one is the most beautiful breed."
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
        "body": "The meeting was about cats. It is not clear which one is the most beautiful breed."
      }
    }
  }
]
```
