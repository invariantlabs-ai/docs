---
title: Images
description: Secure images given to, or produced by, your agentic system.
---

# Images

<div class='subtitle'>
Secure images given to, or produced by your agentic system.
</div>

At the core of computer vision agents is the ability to perceive their environment through images, typically by taking screenshots to assess the current state. This visual perception allows agents to understand interfaces, identify interactive elements, and make decisions based on what they "see."

Additionally, some systems may allow users to submit images, posing additional risks.

<div class='risks'/>
> **Image Risks**<br/>
> Images may be produced by, or provided to, an agentic system, presenting potential security risks. For example, an insecure agent could:

> * Capture **personally identifiable information (PII)** like names or addresses.
> 
> * View credentials such as **passwords, API keys, or access tokens** like present in passport images or other documents.
> 
> * Get **prompt injected or jailbroken** from text in an image.
> 
> * Generate images with **explicit or harmful content**.


Guardrails provide you a powerful way to enforce visual security policies, and to limit the agent's perception to only the visual information that is necessary and appropriate for the task at hand.


## ocr <span class="parser-badge"/>
```python
def ocr(
    data: str, List[str],
    config: Optional[dict]
) -> List[str]
```
Given an image as input, this parser extracts and returns the text in the image using [Tesseract](https://github.com/tesseract-ocr/tesseract).

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `str, List[str]` | A single base64 encoded image or a list of base64 encoded images. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` | A list of extracted pieces of text from `data`. |

### Analyzing Text in Images
The `ocr` function is a  <span class="parser-badge" size-mod="small"></span> so it returns the data found from parsing its content; in this case, any text present in an image will be extracted. The extracted text can then be used for further detection, for example detecting a prompt injection in an image, like the example below.

**Example:** Image Prompt Injection Detection.
```python
from invariant.detectors import prompt_injection
from invariant.parsers import ocr

raise "Found Prompt Injection in Image" if:
    (msg: Image)
    ocr_results := ocr(msg)
    prompt_injection(ocr_results)
```
<div class="code-caption"> The text extracted from the image can be checked using, for example, detectors.</div>


## image <span class="builtin-badge"/>

```python
def image(
    content: Content | List[Content]
) -> List[Image]
```
Given some `Content`, this <span class="builtin-badge" size-mod="small"></span> extracts all images. This is useful when messages may contain mixed content.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `content`      | `Content | List[Content]` | A single instance of `Content` or a list of `Content`, possibly with mixed types. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[Image]` | A list of extracted `Image`s from `content`. |


### Extracting Images
Some policies may wish to check images and text in specific ways. Using `image` and `text` we can create a policy that detects prompt injection attacks in user input, even when we allow users to submit images.

**Example:** Prompt Injection Detection in Both Images and Text 
```python
from invariant.detectors import prompt_injection
from invariant.parsers import ocr

raise "Found Prompt Injection" if:
    (msg: Message)

    # Only check user messages
    msg.role == 'user'
    
    # Use the image function to get images
    ocr_results := ocr(image(msg))

    # Check both text and images
    prompt_injection(text(msg))
    prompt_injection(ocr_results)
```
<div class="code-caption"> Extract specific content types from mixed-content messages.</div>