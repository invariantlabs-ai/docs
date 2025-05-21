---
title: Scanning Your MCP Servers with MCP-Scan
description: Use MCP-scan to ensure your MCP servers are safe to use.
icon: bootstrap/file-break
---

# Scanning with `mcp-scan scan`

<div class='subtitle'>
Scans your configured MCP servers for malicious tool descriptions and behavior.
</div>

Using `mcp-scan scan`, you can statically scan your configured MCP servers for malicious tool descriptions and behavior, in order to prevent attacks from untrusted MCP servers. 

`mcp-scan scan` is a static check that only runs when you invoke it, and does not run in the background.

<br/>

<img src="../assets/scan.svg" alt="scanning-overview-diagram" class="textwidth" style="max-width: 480pt; margin: auto; display: block;" />

<br/>

If you also want to enable runtime monitoring, see the [Proxying chapter](./proxying.md) for more information.

## Quick Start
To run MCP-Scan, use the following command:

```bash
uvx mcp-scan@latest
```

or

```
npx mcp-scan@latest
```

**Example Output**:

![mcp-scan-output](https://invariantlabs.ai/images/mcp-scan-output.png)

## How It Works
MCP-Scan searches through your configuration files to find MCP server configurations. It connects to these servers and retrieves tool descriptions.

It then scans tool descriptions, both with local checks and by invoking Invariant Guardrailing via an API. For this, tool names and descriptions are shared with invariantlabs.ai. By using MCP-Scan, you agree to the invariantlabs.ai [terms of use](https://explorer.invariantlabs.ai/terms) and [privacy policy](https://invariantlabs.ai/privacy-policy).

Invariant Labs is collecting data for security research purposes (only about tool descriptions and how they change over time, not your user data). Don't use MCP-scan if you don't want to share your tools.
You can run MCP-scan locally by using the `--local-only` flag. This will only run local checks and will not invoke the Invariant Guardrailing API, however it will not provide as accurate results as it just runs a local LLM-based policy check. This option requires an `OPENAI_API_KEY` environment variable to be set.

MCP-scan does not store or log any usage data, i.e. the contents and results of your MCP tool calls.

### Command Line Options

Next to the main `mcp-scan scan` command, MCP-scan supports a number of command line options. For more information use the `--help` flag, or see the [project README](http://github.com/invariantlabs-ai/mcp-scan).

### Examples

```bash
# Scan all known MCP configs
mcp-scan

# Scan a specific config file
mcp-scan ~/custom/config.json

# Just inspect tools without verification
mcp-scan inspect

# View whitelisted tools
mcp-scan whitelist

# Whitelist a tool
mcp-scan whitelist tool "add" "a1b2c3..."
```