
# Loop Detection

<div class='subtitle'>
Detect and prevent infinite loops in your agentic system.
</div>

Loop detection is a critical component of any agentic system, as it helps to prevent infinite loops and other undesired behavior. Guardrails provides a simple way to detect and prevent loops in your agentic system.

> **Looping Risks**<br/>
> Loops are a common source of bugs and errors in agentic systems. For example, an insecure agent could:

> * Get stuck in an infinite loop, **consuming resources and causing the system to crash**

> * Get stuck in a loop that causes it to **perform a irreversible action**, such as sending a message many times

> * Get stuck in a loop, requiring **many expensive LLM calls**, causing the system to run out of tokens or money
