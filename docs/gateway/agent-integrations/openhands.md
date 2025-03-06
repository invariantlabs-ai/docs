# OpenHands Integration

[OpenHands](https://github.com/All-Hands-AI/OpenHands) (formerly OpenDevin) is a platform for software development agents powered by AI. 

You can easily modify the OpenHands setup to use the Invariant Gateway.

## Getting the Invariant API Key

Visit the [Explorer Documentation](https://explorer.invariantlabs.ai/docs/explorer) to learn how to obtain your own API key.

OpenHands does not support custom headers, so you **cannot** pass the Invariant API Key via `Invariant-Authorization` header. However, **there is a workaround** using the Invariant Gateway.

## Adjust the API Key Format

Instead of setting your LLM Provider's API Key normally, modify the environment variable as follows:

```bash
export OPENAI_API_KEY={your-openai-api-key};invariant-auth={your-invariant-api-key}
export ANTHROPIC_API_KEY={your-anthropic-api-key};invariant-auth={your-invariant-api-key}
```

## Modify the API Base

Enable the `Advanced Options` toggle under settings and update the `Base URL` to the following

```
https://explorer.invariantlabs.ai/api/v1/gateway/{add-your-dataset-name-here}/openai
```

<img src="../../assets/openhands-integration.png" style="height: 400px !important; display: block; margin: 0 auto;"/>

> **Note:** Do not include the curly braces `{}`.

The Invariant Gateway extracts the `invariant-auth` field from the API key and correctly forwards it to Invariant Explorer while sending the actual API key to OpenAI or Anthropic.

This will automatically trace your agent interactions in Invariant Explorer.

## Explore other integrations

<div class='tiles'>

<a href="../microsoft-autogen" class='tile'>
    <span class='tile-title'>Microsoft AutoGen Integration →</span>
    <span class='tile-description'>Enhance and debug your Microsoft AutoGen agents effortlessly using the Gateway.</span>
</a>

<a href="../openai-swarm" class='tile'>
    <span class='tile-title'>OpenAI Swarm Integration →</span>
    <span class='tile-description'>Enhance and debug your OpenAI Swarm agents effortlessly using the Gateway.</span>
</a>

<a href="../swe-agent" class='tile'>
    <span class='tile-title'>SWE-agent Integration →</span>
    <span class='tile-description'>Streamline the development and debugging of SWE-agent applications with the Gateway.</span>
</a>

<a href="../browser-use" class='tile'>
    <span class='tile-title'>Browser Use Integration →</span>
    <span class='tile-description'>Optimize and troubleshoot your Browser Use applications with Invariant Gateway.</span>
</a>

</div>