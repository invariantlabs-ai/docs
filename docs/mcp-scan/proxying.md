---
title: Scanning Your MCP Servers with MCP-Scan
description: Use MCP-scan to ensure your MCP servers are safe to use.
icon: bootstrap/hdd-network
---

# Proxying with `mcp-scan proxy`

<div class='subtitle'>
Monitors, logs and safeguards all MCP traffic on your machine.
</div>

The `mcp-scan proxy` command temporarily intercepts the MCP traffic on your machine, using [Gateway](../guardrails/gateway.md), to safeguard and audit MCP calls on your machine. This allows you to inspect the runtime behavior of agents and tools, and to prevent attacks from e.g. untrusted sources (like websites or emails) that may try to exploit or hijack your agents.

`mcp-scan proxy` is a dynamic security layer that runs as long as the CLI process is running, and continuously monitors all MCP traffic on your machine.

<img src="../assets/proxy.svg" alt="proxying-overview-diagram" class="textwidth" style="max-width: 420pt; margin: 40pt auto; display: block;" />

## Usage

To get started, run the following command in your terminal:

```
uvx mcp-scan@latest proxy
```

As visible from the output, this temporarily rewrites all MCP server configurations across your machine, to route calls via [Gateway](../guardrails/gateway.md), allowing you to inspect and guardrail MCP calls.

This transparently proxies all MCP calls on your machine, and logs them to the console, in which `mcp-scan proxy` is running:

!!! note

    Some MCP clients require a restart or a re-initialization of the proxied MCP server, for proxying to take effect.

**Output** (compact mode):
```
-- → vscode (user@UserHostMachine) used arxiv-server to tools/list (call_2) --
Arguments:
{}

-- ← (call_2) vscode (user@UserHostMachine) used arxiv-server to tools/list --
[{'name': 'search_papers', 'description': 'Search for papers on arXiv with advanced filtering', 'inputSchema': {'type': 'object', 'properties': {'query': {'type': 
'string'}, 'max_results': {'type': 'integer'}, 'date_from': {'type': 'string'}, 'date_to': {'type': 'string'}, 'categories': {'type': 'array', 'items': {'type': 
'string'}}}, 'required': ['query']}}, {'name': 'download_paper', 'descriptio...

-- → vscode (user@UserHostMachine) used arxiv-server to search_papers (call_3) --
Arguments:
{'query': 'LMQL language model query language', 'max_results': 10}

-- ← (call_3) vscode (user@UserHostMachine) used arxiv-server to search_papers --
{'total_results': 10, 'papers': [{'id': '2505.14687v1', 'title': 'Grouping First, Attending Smartly: Training-Free Acceleration for Diffusion Transformers', 
'authors': ['Sucheng Ren', 'Qihang Yu', 'Ju He', 'Alan Yuille', 'Liang-Chieh Chen'], 'abstract': 'Diffusion-based Transformers have demonstrated impressive 
generative\ncapabilities, but their high computational costs hinder practical deploymen...

---------------------------------------------------------------
GUARDRAIL LOG Found PII in tool output. (124 ranges)
---------------------------------------------------------------
```

As shown here, both MCP calls and responses are logged, together with relevant metadata like the server and client name, username, as well as the call ID.

### Command Line Options

```
--pretty [oneline|compact|full]  Pretty print the output. (default: "oneline")
```

`--pretty` controls the output format of the logs. The default is `compact`, which is a human-readable format that is easy to read. The `oneline` format is a single line per log entry, and the `full` format is a more verbose format that includes fully formatted tool calls and outputs.