# Computer Use Agents

<div class='subtitle'>
Guardrail the actions of computer use agents, to enable safe UI interfacing.
</div>

Computer use agents are powerful general-purpose reasoners, equipped with their own computer and the ability to interact with it. However, to ensure security and correctness properties, it is important to guardrail the actions of these agents, to prevent them from performing undesired or harmful actions.

> **Computer Use Agent Risks**<br/>
> Computer use agents are powerful general-purpose reasoners, equipped with their own computer and the ability to interact with it. For example, an insecure agent could:

> * Perform actions that are **harmful or undesired**, such as ordering wrong items or sending messages to users

> * Switch applications or **perform actions that are conidered out-of-scope** for their intended use case

> * Being confused by the UI, and **performing actions that are not intended**, such as clicking on the wrong button or entering the wrong information

> * Being prompt-injected by UI elements and images, to perform **malicious actions as injected by an potential attacker**