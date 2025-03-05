# Integrate Your Agent

<div class='subtitle'>Get your agent ready for testing</div>

`testing` works with a simple yet powerful trace format as the common denominator for testing agents.

This trace format is a list of dictionaries, where each dictionary represents a message in the conversation. It is equivalent to the [OpenAI chat format](https://platform.openai.com/docs/api-reference/chat/create).

Each message has a `role` key that specifies the role of the speaker (e.g., `user` or `assistant`) and a `content` key that contains the message content.

```json
{
    "role": "user",
    "content": "Hello there"
},
{
    "role": "assistant",
    "content": "Hello there",
    "tool_calls": [
        {
            "type": "function",
            "function": {
                "name": "greet",
                "arguments": {
                    "name": "there"
                }
            }
        }
    ]
},
{
    "role": "user",
    "content": "I need help with something."
}
```

Based on this simple format, it is easy to integrate your agent with Invariant `testing`.

> **Extended Format Support** `testing` also supports additional custom properties in the trace format, e.g. for metadata. Note, however, that convenience methods like `Trace.tool_calls()` assume the standard format. Similarly, if you are planning to visualize the trace in [Explorer](https://explorer.invariantlabs.ai/explorer/), we advise you to stick to the standard format.

To learn about how to do this, follow one of the example guides below:

<div class='tiles'>

<a href="../../examples/computer-use/" class='tile primary'>
    <span class='tile-title'>Computer Use Agents →</span>
    <span class='tile-description'>Integrate your computer use agent with Invariant <code>testing</code></span>
</a>

<a href="../../examples/langgraph/" class='tile primary'>
    <span class='tile-title'>LangGraph Agents →</span>
    <span class='tile-description'>Test your LangGraph agent with <code>testing</code></span>
</a>

<a href="../../examples/openai-python-agent/" class='tile'>
    <span class='tile-title'>Function Calling Agents →</span>
    <span class='tile-description'>Integrate your agent with Invariant <code>testing</code> using function calls</span>
</a>

<a href="../../examples/swarm/" class='tile'>
    <span class='tile-title'>Swarm Agents →</span>
    <span class='tile-description'>Test your swarm agent with Invariant <code>testing</code></span>
</a>

</div>
