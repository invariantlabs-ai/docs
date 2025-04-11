# Images (WIP)

<div class='subtitle'>
Guardrail the visual perception of your agentic system.
</div>

At the core of computer vision agents is the ability to perceive their environment through images, typically by taking screenshots to assess the current state. This visual perception allows agents to understand interfaces, identify interactive elements, and make decisions based on what they "see."

For security and privacy reasons, it is important to ensure that all visual information an agent processes is validated and well-scoped, to prevent exposure of sensitive information or inappropriate content.

Guardrails provide you a powerful way to enforce visual security policies, and to limit the agent's perception to only the visual information that is necessary and appropriate for the task at hand.

<div class='risks'/>
> **Image Risks**<br/>
> Since images are an agent's window to perceive the world, they can expose sensitive or inappropriate content. For example, an insecure vision agent could:

> * Capture personally identifiable information (PII) like names or addresses
> 
> * View credentials such as passwords, API keys, or access tokens
> 
> * Capture copyrighted material that shouldn't be processed or shared

## Checking Image Content

**Example**: Checking for PII in images

```python
from invariant.parsers import ocr

raise "PII in image text" if:
    (img: Image)
    image_text := ocr(img)
    any(pii(image_text))
```

**Example**: Check copyrighted material


// Maybe something that uses the information in the image
// So combine with like toolcalls?
```python
from ...

raise "Copyrighted text in image" if:
    (msg: Assistant)
    images := image(msg) # Extract all images in a single message
    copyright(ocr(images))
```


## ocr <span class="parser-badge"/>
```python
def ocr(
    data: Union[str, List[str]],
    config: Optional[dict]
) -> List[str]
```
Parser to extract text from images.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` | A single base64 encoded image or a list of base64 encoded images. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` | A list of extracted pieces of text from `data`. |

### Analyzing Text in Images
The `ocr` function is a  <span class="parser-badge" size-mod="small"></span> so it returns the data found from parsing its content, in this case extracting text from an image. The extracted text can then be used for further detection, for example detecting a prompt injection in an image, like the example below.

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
    content: Union[Content | List[Content]]
) -> List[Image]
```
Given some `Content`, this <span class="builtin-badge" size-mod="small"></span> extracts all images. This is useful when messages may contain mixed content.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `content`      | `Union[Content | List[Content]]` | A single instance of `Content` or a list of `Content`, possibly with mixed types. |

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
    
    # Use image function to get images
    ocr_results := ocr(image(msg))

    # Check both text and images
    prompt_injection(text(msg))
    prompt_injection(ocr_results)
```
<div class="code-caption"> Extract specific content types from mixed-content messages.</div>