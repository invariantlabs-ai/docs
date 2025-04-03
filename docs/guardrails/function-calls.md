# Function Calls

<div class='subtitle'>
Guardrail the function and tool calls of your agentic system.
</div>

At the core of any agentic systems are function and tool calls, i.e. the ability for the agent to interact with the environment via desiganted functions and tools. 

For security and safety reasons, it is important to ensure that all tool calls an agent executes are validated and well-scoped, to prevent undesired or harmful actions.

<div class='risks'/>
> **Tool Calling Risks**<br/>
> Since tools are an agent's interface to interact with the world, they can also be used to perform actions that are harmful or undesired. For example, an insecure agent could:

> * Leak sensitive information, e.g. via a `send_email` function

> * Delete an important file, via a `delete_file` or a `bash` command

> * Make a payment to an attacker

> * Send a message to a user with sensitive information