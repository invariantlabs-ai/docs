---
title: Welcome
---

# Invariant Agent Security and Debugging

<div class='subtitle'>Invariant offers a low-friction toolchain for securing, testing, and debugging agentic AI systems.</div>

The Invariant eco-system offers a toolchain for building and securing agentic AI systems. It is designed to help you build secure agentic systems _from scratch_ or to _secure an existing system with very little overhead_.

For this, it relies on an entirely transparent proxy that intercepts and traces the LLM calls of your agent. This enables security guardrailing and insights during operation, without requiring any code changes to the agent.

<div class='overview small'>
    <div class='clear box thirdparty'>
        Agent
    </div>
    <div class='box fill main clear'>
        <a class='box clear' href='./gateway'>
            <p>Invariant Gateway</p>
            <i>Transparent LLM proxy to trace and intercept LLM calls</i>
            <i class='more'>→</i>
        </a>
    </div>
    <div class='clear box thirdparty'>
        LLM Provider
    </div>
</div>

## Overview

Based on the gateway, Invariant offers a family of tools for securing, testing and debugging AI agents. These tools are designed to be used in conjunction with the gateway, which greatly facilitates integration.

You can use each tool independently, or in combination with each other. The following interactive figure illustrates the Invariant eco-system and how the tools fit together:

<br/>
<br/>

<div class='overview'>
    <div class='clear box thirdparty'>
        Agent
    </div>
    <div class='box fill main clear'>
        <a class='box clear' href='./gateway'>
            <p>Invariant Gateway</p>
            <i>Transparent LLM proxy to trace and intercept LLM calls</i>
            <i class='more'>→</i>
        </a>
        <div class='online'>
            <div class='title'>Online Guardrails</div>
            <div class='box fill clear' style="flex: 1;">
                <p>Analyzer</p>
                <i>Agent Security Scanner</i>
                <i class='more'>→</i>
            </div>
        </div>
        <div class='offline'>
            <hr/>
            <div class='title'>Offline Analysis</div>
            <a class='box fill clear' href='./explorer'>
                <p>Explorer</p>
                <i>Trace viewing and debugging</i>
                <i class='more'>→</i>
            </a>
            <a class='box fill clear' href='./testing'>
                <p>Testing</p>
                <i>Agent Unit Testing</i>
                <i class='more'>→</i>
            </a>
        </div>
    </div>
    <div class='clear box thirdparty'>
        LLM Provider
    </div>
</div>

You can click any of the boxes to learn more about the respective tool.

## Next Steps

<div class='tiles'>

<a href="gateway/" class='tile primary'>
    <span class='tile-title'>Gateway →</span>
    <span class='tile-description'>Setup the Invariant Gateway to trace and intercept LLM calls</span>
</a>

<a href="explorer/" class='tile primary'>
    <span class='tile-title'>Observe and Debug →</span>
    <span class='tile-description'>Use Invariant Explorer to inspect and debug your AI agent traces</span>
</a>

<a href="explorer/benchmarks" class='tile'>
    <span class='tile-title'>Benchmarks →</span>
    <span class='tile-description'>Submit your AI agent to the Invariant benchmark registry for comparison</span>
</a>

<a href="testing/" class='tile primary'>
    <span class='tile-title'>Testing →</span>
    <span class='tile-description'>Use Invariant <code>testing</code> to build debuggable unit tests for your AI agents</span>
</a>

<a href="explorer/Explorer_API/2_traces" class='tile'>
    <span class='tile-title'>Trace Format →</span>
    <span class='tile-description'>Learn about the Invariant trace format and how to structure your traces for ingestion</span>
</a>

<a href="explorer/Explorer_API/Uploading_Traces/push_api" class='tile'>
    <span class='tile-title'>Pushing Traces →</span>
    <span class='tile-description'>Learn about traces, datasets and annotations on Invariant.</span>
</a>

</div>
