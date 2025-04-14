# Guardrails in Gateway

<div class="subtitle">
Learn how Invariant guardrailing rules are enforced and deployed.
</div>

Invariant is a guardrailing layer, located between you and your LLM and MCP servers. This means, it intercepts, analyzes and secures every LLM and tool interaction of your agentic system, without you having to change your code.

<br/><br/>
<img src="site:/guardrails/gateway-integration.svg" alt="Invariant Architecture" class="invariant-architecture" style="display: block; margin: 0 auto; width: 100%; max-width: 300pt;"/>
<br/><br/>

To use Invariant, you need to integrate [Invariant Gateway](../gateway/index.md), a transparent LLM and MCP proxy service, that integrates Invariant Guardrails in your system.

## LLM Proxying and Guardrails

In the case of LLM proxying, gateway will intercept every LLM call of you agent system (including the current agent context), apply the configured guardrailing rules to the input, and then invoke the actual LLM provider.

Once the LLM provider returns the response, the gateway will again apply your guardrailing rules to the LLM response, and ensure that the response and its consequence (e.g. tool calls) are safe to execute, according to your guardrails.

**Handling Failure:** In case any of the checks fail, Gateway will return an HTTP error response instead of the LLM response, allowing your agent system to handle the guardrail violation gracefully. 

To help with that, the error response will include information on the violated guardrail, including the specified error message, the violated rule, and the address of the violating components in your agent's context (e.g. messages indices, contents and sub-ranges).

<br/><br/>
<img src="site:/guardrails/gateway-llm.svg" alt="LLM Proxying and Guardrails" class="llm-proxying-guardrails" style="display: block; margin: 0 auto; width: 100%; max-width: 400pt;"/>

### Pipelining and Incremental Guardrailing

In contrast to traditional guardrailing system, Guardrails follows a pipelined and incremental approach to guardrail evaluation. For this, it leverages the natural LLM latency as well as stateful and incremental evaluation semantics in its rule engine, to significantly reduce guardrailing latency, incurring much less runtime latency compared to traditional pre- and post-guardrailing approaches:

<br/><br/>
<img src="site:/guardrails/pipelined.svg" alt="Pipelining and Incremental Guardrailing" class="pipelining-incremental-guardrails" style="display: block; margin: 0 auto; width: 100%;"/>
<br/><br/>

As illustrated above, input latency can oftentimes be entirely eliminated by our pipelined execution approach, whereas output latency is greatly reduced, because of Invariant's stateful, cached and pre-computed rule evaluation. Guardrails' rule engine will eagerly pre-compute all matching parts of a rule, such that once the LLM response arrives, only very little checking remains. To achieve this, Guardrails automatically orchestrates rule evaluation, including ML model inference, using an optimized execution graph.

## Deploying your Guardrails

To deploy your guardrailing rules, you have two options:

<!-- 1. **Stateless via Header**: You can send your guardrailing rules with every LLM call in a desiganted `Invariant-Guardrails` header field.

2. **Managed Via Exlorer**: You can manage your guardrailing rules via Invariant Explorer. This decouples guardrail management from your agent code, but allows for centralized management of guardrails.  -->

<div class='tiles'>
<a href="#via-header" class='tile primary'>
    <span class='tile-title'>1. Stateless via Header</span>
    <span class='tile-description'>
        Send your guardrailing rules with every LLM call in a designated <code>Invariant-Guardrails</code> header field and manage them in your code.
    </span>
</a>
<a href="#via-explorer" class='tile primary'>
    <span class='tile-title'>2. Managed via Explorer</span>
    <span class='tile-description'>
        Manage rules via the Explorer web interface, and decouple guardrail management from your agent code.
    </span>
</a>
</div>

<!-- ### Configuring Guardrails via Header -->
<h3 id="via-header">Configuring Guardrails via Header</h3>

To pass guardrailing rules with every request, you can specify a custom header field `Invariant-Guardrails` in your LLM client. This header should contain the guardrailing rules in a string format:

**Example:** Setting Up Your OpenAI client to use Guardrails
```python hl_lines='7 8 9 15 16 17 18 19 20 21'
import os
from openai import OpenAI

# 1. Guardrailing Rules

guardrails = """
raise "Rule 1: Do not talk about Fight Club" if: 
    (msg: Message)
    "fight club" in msg.content
"""


# 2. Gateway Integration

client = OpenAI(
    default_headers={
        "Invariant-Authorization": "Bearer " + os.getenv("INVARIANT_API_KEY"),
        "Invariant-Guardrails": guardrails.encode("unicode_escape"),
    },
    base_url="https://explorer.invariantlabs.ai/api/v1/gateway/openai",
)

# 3. Using the model
client.chat.completions.create(
    messages=[{"role": "user", "content": "What do you know about Fight Club?"}],
    model="gpt-4o",
)
```
> **Important:** Note that you have to `.encode("unicode_escape")` the guardrails string, to ensure that the header is properly encoded (HTTP headers do not support raw newlines).

This snippet demonstrates how to use the managed instance of Gateway, accessible via an `https://explorer.invariantlabs.ai` account (requires an API key).

Apart from this, you can also use a local instance of Gateway, by setting the `base_url` to your local instance. See the [Gateway documentation](../gateway/self-hosted.md) for more details on local deployment.

Passing via header is a stateless approach, meaning that every request will need to include the guardrailing rules. This is useful for quick testing and prototyping, but means that your agentic system must define and send its own guardrailing rules with every request. 

<h3 id="via-explorer">Configuring Guardrails via Explorer</h3>

To configure guardrailing rules outside of the actual agentic system, you can use [Invariant Explorer](https://explorer.invariantlabs.ai). This allows you to manage your guardrailing rules in a centralized way, and decouples guardrail management from your agent code. It is also useful, if you do not control the code of the agentic system itself, but want to constrain its behavior.

Explorer provides a comprehensive user interface to manage and configure your guardrailing rules, including a list of suggested rules, a rule editor, and a rule testing interface.

Please see the chapter on [Guardrails in Explorer](./explorer.md) for more details on how to use Explorer to manage your guardrailing rules.

<figure class="styled-figure half">
<img src="site:/guardrails/guardrails-in-explorer-screenshot.png" alt="Screenshot showing Guardrails configuration in Explorer" class="guardrails-in-explorer-screenshot"/>
<figcaption style="text-align: center; font-size: 0.8em; color: #666;">Screenshot showing Guardrails configuration in Explorer</figcaption>
</figure>
