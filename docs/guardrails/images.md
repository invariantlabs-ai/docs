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