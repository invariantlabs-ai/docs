---
title: Issue Code Reference
description: Archive of `mcp-scan` issues codes.
icon: bootstrap/x-circle
---

# Issue Code Reference
This is the reference for all issues that can be detected via `mcp-scan`.

## Issues
Issues are identified security threats that result in compromised MCP servers or skills, and should be addressed as soon as possible.
<h3 id="E001">E001: Tool poisoning, prompt injection.</h3>
Detected a prompt injection in the tool description. The tool should be deactivated immediately. 
<h3 id="E002">E002: Tool poisoning, cross server interaction.</h3>
The tool description refers to a tool from another server. MCP servers should be self-contained. If an MCP server refers to a tool from another server, there is a high risk of compromising the behavior of that tool.
<h3 id="E003">E003: Tool poisoning, hijacking agent behavior.</h3>
The tool description contains instructions that interfere with the Agent's course of action. Tools should be at the disposal of the agent and should not provide it with instructions. 
<h3 id="E004">E004: Prompt injection in skill.</h3>
Detected a prompt injection in the skill instructions. The skill attempts to override the agent's safety guidelines or intended behavior.
<h3 id="E005">E005: Suspicious download URL detected in skill.</h3>
Detected a suspicious URL in the skill instructions that could lead the agent to download and execute malicious scripts or binaries.
<h3 id="E006">E006: Malicious code patterns detected in skill.</h3> 
Detected high-risk patterns in the skill content, such as data exfiltration, backdoors, remote code execution, or obfuscation techniques.

## Warnings
Warnings are potential security threats. Keep an eye on them.
<h3 id="W001">W001: Tool poisoning, suspicious word used.</h3>
The tool's description includes one or more words commonly linked to malicious activity, such as "Ignore", "crucial", or "important".
<h3 id="W003">W003: Entity has changed.</h3>
The tool description has changed. This could be a rug pull attack, where the agent has swapped a benign tool with a malicious one.
<h3 id="W007">W007: Insecure credential handling detected in skill.</h3>
The skill handles credentials (such as API keys, secrets, passwords, or tokens) insecurely by directly adding them to the LLM context. This exposure could lead to data exfiltration attacks.
<h3 id="W008">W008: Hardcoded secrets detected in skill.</h3>
Detected sensitive credentials (such as API keys, passwords, or tokens) directly embedded within the skill instructions. Secrets should never be hardcoded in plain text.
<h3 id="W009">W009: Direct financial execution capability detected.</h3>
The skill contains specific tools explicitly designed for financial operations, such as processing payments, cryptocurrency transactions, banking integrations, or asset trading.
<h3 id="W011">W011: Exposure to untrusted third-party content.</h3>
The skill is designed to fetch or read data from untrusted public sources (such as arbitrary websites or social media). This creates a risk of indirect prompt injection, where malicious external content can manipulate the agent's behavior.
<h3 id="W012">W012: Unverifiable external dependency detected.</h3>
The skill fetches instructions or code from an external URL at runtime (e.g., raw GitHub files or Pastebin). This dynamic dependency allows the external source to modify the agent's behavior without updates to the skill itself.
<h3 id="W013">W013: Attempt to compromise machine state in skill instructions.</h3>
The skill instructions encourage the agent to alter the host system's fundamental state or security configuration. Examples include creating new user accounts, modifying core system files, or accessing protected system credential stores.

## Toxic Flows
A toxic flow is a threat that arises when multiple tools (that are benign individually) can be used in combination by an attacker in a malicious way.
<h3 id="TF001">TF001: Data Leak Toxic Flow.</h3>
A Data Leak Toxic Flow allows the attacker to leak private data from the agent. For this to work, three components are required:

* An **untrusted content** tool: A tool whose output could be malicious, such as fetching information from a webpage set up by someone else. 
* A **private data** tool: A tool that exposes private data to the Agent, by reading a file from the user's machine, for example.
* A **public sink** tool: A tool that the Agent can use to send information back to the attacker. This could mean sending a private message to an arbitrary phone number, or simply making some information public on the internet. Examples include writing to a public repo or sending a message on WhatsApp.

The attack triggers when the agent uses the **untrusted content** tool for any unrelated user task. The output of the tool contains a prompt injection, or a set of malicious instructions that compromise the agent. Once compromised, the agent can use the **private data** tool to fetch the user's private data. Finally, the compromised agent can leak such data using the **public sink** tool.

!!! note 

    A single tool may act as **untrusted content**, **private data**, and **public sink** simultaneously.

<h3 id="TF002">TF002: Destructive Toxic Flow.</h3>
A Destructive Toxic Flow allows the attacker to cause permanent damage. For it to work, it needs two components:

* An **untrusted content** tool: A tool whose output could be malicious, such as fetching information from a webpage set up by someone else.
* A **destructive** tool: An irreversible tool that can be used in a destructive way, like deleting a file on the user's machine, or sending money.

The attack triggers when the agent uses the **untrusted content** tool for any unrelated user task. The output of the tool contains a prompt injection, or a set of malicious instructions that compromise the agent. Once compromised, the agent can use the **destructive** tool to irreversibly damage the environment.

!!! note 

    A single tool may act as **untrusted content**, **destructive** simultaneously.

## Analysis Errors
An Analysis Error implies that something went wrong during the scan, and that the MCP servers are not being scanned as expected.
<h3 id="X001">X001: Could not reach analysis server.</h3>
The backend of `mcp-scan` could not be reached. This might happen when:

* The `mcp-scan` backend is down.
* You manually selected the backend using the `--base-url` flag, and the backend you selected cannot be reached.
* There is no connection to the internet.

<h3 id="X002">X002: Whitelisted.</h3>
The tool has been whitelisted. It will now show in green even if issues are detected.
