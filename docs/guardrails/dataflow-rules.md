# Dataflow Rules

<div class='subtitle'>
Secure the dataflow of your agentic system, to ensure that sensitive data never leaves the system through unintended channels.
</div>

Due to their dynamic nature, agentic systems often mix and combine data from different sources, and can easily leak sensitive information. Guardrails provides a simple way to define dataflow rules, to ensure that sensitive data never leaves the system through unintended channels.

<br/><br/>
<img src="site:assets/guardrails/dataflow.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 400pt;"/>
<br/><br/>

<div class='risks'/>
> **Dataflow Risks**<br/>

> Due to their dynamic nature, agentic systems often mix and combine data from different sources, and can easily leak sensitive information. For example, an insecure agent could:

> * Leak sensitive information, such as **API keys or passwords**, to an external service

> * Send sensitive information, such as **user data or PII**, to an external service

> * Be prompt-injected by an external service via indirect channels, to **perform malicious actions** as injected by an potential attacker
