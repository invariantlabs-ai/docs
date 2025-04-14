---
title: Overview
---

# Guardrails in Explorer

<div class="subtitle">
Learn how to configure and manage your guardrailing rules in Explorer.
</div>

[Explorer](../explorer/index.md) is Invariant's configuration and observability tool. It allows you to configure guardrails, inspect and debug your agent traces and analyze your agentic system for novel failure modes.

It exposes a simple configuration interface, that allows you to configure, test and deploy guardrails to your agentic system, as well as inspect guardrail failures in detail.

<img src="site:/guardrails/guardrails-configuration-explorer.png" alt="Explorer Landing" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 650pt;"/>

## How Gateway and Explorer Work Together

By default, each Explorer project exposes its own [Gateway](../gateway/index.md) instance, allowing you to easily get started quickly with your first Invariant-augmented agent.

You can think of an Explorer project as a _customized version of your LLM and MCP servers_ that automatically adhere to the set of guardrailing rules you configure in Explorer.

Apart from this, Explorer will also log all your requests, allowing you to inspect your agent behavior in detail and configure the guardrails to your liking.

<br/><br/>
<img src="site:/guardrails/explorer-and-gateway.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 450pt;"/>

## Getting Started

You can get started with Explorer and Guardrails, simply by adjusting your project's LLM base URL.


**Example:** Setting Up Your OpenAI client to use Explorer and Guardrails
```python hl_lines='11'
import os
from openai import OpenAI

# 1. Explorer+Gateway Integration

client = OpenAI(
    default_headers={
        "Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY")
    },
    # replace '<your-project-id>' with an new Explorer project ID (alphanumeric, dash allowed)
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/<your-project-id>/openai",
)

# 2. Using the model
client.chat.completions.create(
    messages=[{"role": "user", "content": "What do you know about Fight Club?"}],
    model="gpt-4o",
)
```

After this change, all your LLM requests will automatically be logged in your Explorer project. If the project does not exist on first use, it will be created automatically.

To use Anthropic models instead, you can adjust the `/openai` portion of your base URL to `/anthropic`. Apart from this, functionality like streaming and tool calling are supported seamlessly through Gateway.

To learn more about how Gateway works, check out the [Gateway documentation](../gateway/index.md).

## Configuring Your First Guardrailing Rules

To configure guardrails, switch to the `Guardrails` tab in the top navigation bar of your Explorer project.

<br/><br/>
<img src="site:/guardrails/guardrails-configuration-explorer.png" alt="Explorer Landing" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 650pt;"/>

Here, you are presented with two options:

1. **Create a new guardrail**: This allows you to create a new guardrail from scratch.
2. **Use a Guardrail Suggestion**: This allows you to use a pre-defined guardrail for your project.

## Creating a New Guardrail

To create a new Guardrail from scratch, click on the `Create Guardrail` button. 

This will open the following modal, allowing for further configuration of the guardrail:

<img src="site:/guardrails/new-guardrail.png" alt="New Guardrail" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 650pt;"/>

Here, you can configure the following parameters:

**Name**: The name of the guardrail.

**Action**: The behavior of the guardrail in case of a violation. This can be one of the following:

| Action        | Description                            |
|---------------|----------------------------------------|
| Block       | Blocks the request outright, returning an HTTP error to the client. |
| Log         | Let's the request pass, but logs the violation in Explorer via designated Guardrail violation annotations in the resulting agent traces. This is useful to monitor your agent's violation patterns, without disrupting the agentic process. |
| Paused      | Pauses the enforcement of the guardrail, allowing all request to pass through without evaluating it. This is useful to temporarily disable a guardrail. |


**Guardrailing Rule**: The guardrailing rules that need to be matched for the overall guardrail to be triggered. This is an editor of the Guardrails rule language, providing Invariant's full expressive power as described in this documentation.


## Using a Guardrail Suggestion

To use a pre-defined guardrail, navigate to the bottom part of the Guardrails configuration page.

Here, you will see a list of pre-defined guardrails, along with a short description of the guardrail. These preconfigured rules, are meant to be a starting point for your guardrail configuration. 

Click on the `Details` button to review and modify any preconfigured rule before deploying it to your project. Each guardrail suggestion comes with comments explaining its functionality. 

<img src="site:/guardrails/guardrail-suggestions.png" alt="New Guardrail" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 650pt;"/>

## Deploying Your Guardrail

All changes made in Explorer are automatically deployed to your Gateway instance, enabling you to deploy new guardrails and security policies within seconds. 

This means, even though your agentic system may be running in a slow-to-update production environment, you can quickly respond to new security threats and update your guardrails to your liking, without having to manually update your agent system or re-deploy.

It also enables quick experimentation with new guardrails, without having to worry about the underlying infrastructure. Gateway will automatically pull the latest guardrail configuration from Explorer once a new version is deployed, updating your agent's behavior in real-time.

## Inspecting Guardrail Failures

Lastly, to inspect guardrail failures in detail, navigate to the `Traces` tab in your Explorer project.

Newly pushed traces with Guardrail violations will be automatically annotated with Guardrail violation annotations, highlighting the exact range and location of the guardrail violation in the agent trace.

<figure style="display: block; margin: 0 auto; width: 100%; max-width: 800pt !important; border: 2pt solid #efefef; padding: 10pt; background-color: white;">
<img src="site:/guardrails/guardrail-highlight.png" alt="New Guardrail" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 650pt;"/>
<figcaption style="text-align: center; font-size: 0.8em; color: #666;">Guardrails precisely highlights the location and cause for guardrail violations in the agent trace, allowing users to exactly pinpoint the cause of the violation.</figcaption>
</figure>

As you can see, the guardrail violation is highlighted in the trace down to the violating character range. Given this information, you can easily inspect and refine your guardrailing rules, to precisely match and constrain the behavior of your agentic system.

Further, the shown user annotation view, allows you to comment and collaboratively discuss the guardrail violation with your team, allowing for a collaborative debugging experience, including revisions over time and a full history of past guardrailing behavior.