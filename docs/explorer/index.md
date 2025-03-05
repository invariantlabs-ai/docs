---
title: Overview
---

# Getting Started With Explorer

<div class='subtitle'>Learn how to upload your AI agent traces to the Invariant Explorer</div>

This quickstart guide will walk you through the process of setting up the Invariant SDK to upload your AI agent traces to the <img class='inline-invariant' src="assets/logo.svg"/> [Invariant Explorer](https://explorer.invariantlabs.ai).

You can use Explorer to visualize, analyze, and collaborate on your AI agent traces, as well as compare them with other agents and models.

![Explorer](./assets/explorer-overview.png)

<center>Viewing agent traces in Explorer</center>

## 1. Create an Explorer Account

First, navigate to the <img class='inline-invariant' src="assets/logo.svg"/> [Invariant Explorer](https://explorer.invariantlabs.ai) and create an account via GitHub Sign-In.

If you prefer to keep your data local, you can also [self-host Explorer](./self-hosted.md) on your own infrastructure.

## 2. Create an API Key

Once you have created an account, go to your [User Settings](https://explorer.invariantlabs.ai/settings) and generate an API key.

Make note of your API key, as you will need it to authenticate your uploads. If you're running in a shell, you can export the API key now as an environment variable:

```bash
export INVARIANT_API_KEY=<your-api-key>
```

## 3. Upload Your Traces

You can now upload your AI agent traces to the Invariant Explorer.

For this, you have two options: (A) Automatic upload via the Invariant Gateway, or (B) manual upload via the Invariant SDK.

### Option A: Using Invariant Gateway for Automatic Tracing

The recommended way for frictionless ingestion of your traces is to use the [Invariant Gateway](../gateway/index.md). This is a hosted service that automatically ingests your traces and makes them available in Explorer.

To do so, Gateway proxies your LLM provider like OpenAI (forwarding the request and response behind the scenes) and then extracts the relevant information from the LLM responses to create a trace, automatically making it available in Explorer.

```python hl_lines="3 8"
http_client = Client(
    headers={
        "Invariant-Authorization": "Bearer {your-invariant-api-key}"
    },
)
openai = OpenAI(
    http_client=http_client,
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/my-first-dataset/openai",
)

result = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "What is the capital of France?"},
    ],
)
print("result: ", result)
```

To learn more about using Gateway, check out the [Gateway documentation](../gateway/index.md). This also includes instructions for self-hosting and alternative LLM providers.

To determine the dataset name, replace `my-first-dataset` in the URL with the name of your dataset.

### Option B: Use the Invariant SDK

If, instead, you want more control over the shape and content of your traces, you can also use the manual upload method via the Invariant SDK.

#### B.1 Install the SDK

First, install the Invariant SDK in your Python environment, by running the following command. See [Installation](api/sdk-installation.md) for alternative methods using different package managers.

```bash
pip install invariant-sdk
```

> **Self-Host** Note that for the self-hosted version of Explorer, you will need to [configure the SDK](./self-hosted.md/#usage-and-access) to point to your custom endpoint.

#### B.2 Prepare Your Traces and Upload

Now, you can start preparing your AI agent traces for upload. The Invariant SDK then provides a `Client` class that you can use to upload your traces in an Invariant-compatible format:

```python
from invariant_sdk.client import Client

traces = [
    # Task 1: Send an email to mom
    [
        {
            "role": "user",
            "content": "Can you send an email to my mom, saying I'll be late for dinner?",
        },
        {
            "role": "assistant",
            "content": "Sending an email to your mom now.",
            "tool_calls": [
                {
                    "type": "function",
                    "function": {
                        "name": "send_email",
                        "arguments": {
                            "to": "mom@mail.com",
                            "subject": "Running late, sorry!",
                        }
                    }
                }
            ]
        }
    ]
]

client = Client()
client.create_request_and_push_trace(traces, dataset="my-first-dataset")
```

This will upload your traces to the Invariant Explorer under a new dataset named `my-first-dataset`. If the corresponding dataset already exists, the traces will be appended to it.

To learn more about the expected trace format see the chapter on the [trace format requirements](api/trace-format.md).

## Work With Your Traces in Explorer

After uploading your traces, you can now navigate to the following URL to view your uploaded traces:

```
https://explorer.invariantlabs.ai/<your_username>/my-first-dataset/t/1
```

You can also use the Invariant Explorer to analyze your traces, compare them with other agents, and collaborate with your team.

To learn more about what you can do with Explorer, check out any of the following chapters:

<div class='tiles'>

<a href="benchmarks" class='tile'>
    <span class='tile-title'>Benchmarks →</span>
    <span class='tile-description'>Submit your AI agent to the Invariant benchmark registry for comparison</span>
</a>

<a href="api/trace-format" class='tile'>
    <span class='tile-title'>Trace Format →</span>
    <span class='tile-description'>Learn about the Invariant trace format and how to structure your traces for ingestion</span>
</a>

<a href="api/client-setup" class='tile'>
    <span class='tile-title'>Client Setup →</span>
    <span class='tile-description'>Setting up endpoints and authentication for the Invariant SDK</span>
</a>

<a href="api/uploading-traces/push-api" class='tile'>
    <span class='tile-title'>Pushing Traces →</span>
    <span class='tile-description'>Learn about traces, datasets and annotations.</span>
</a>

</div>
