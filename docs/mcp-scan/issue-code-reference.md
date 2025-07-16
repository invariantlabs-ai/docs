---
title: Issue Code Reference
description: Archive of `mcp-scan` issues codes.
icon: bootstrap/x-circle
---

# Issue Code Reference
This is the reference fo all issues that can be detected via `mcp-scan`.
## Issues
Issues identify compromised mcp servers. Issues should be addressed as soon as possible.
<h3 id="E001">E001: Tool poisoning, prompt injection.</h3>
Detected a prompt injection in the tool description. The tool should be deactivated right away. 
<h3 id="E002">E002: Tool poisoning, cross server interaction.</h3>
The tool description refers to a tool from another server. MCP servers should be self-contained. If a MCP server refers a tool from another server, there is high risk of compromising the behavior of such tool.
<h3 id="E003">E003: Tool poisoning, hijack agent behavior.</h3>
The tool description contains instructions that interfere with the Agent course of action. Tools should be at the disposal of the agent, they should not give instruction to it. 

## Warning
Warning are potential security threats. Keep an eye on them.
<h3 id="W001">W001: Tool poisoning, suspicious word used (as important, critical).</h3>
The tool description contains one or more words which are often associated with malicious behavior. Eg. "Ignore", "crucial", "important"... 
<h3 id="W003">W003: Entity has changed.</h3>
The tool description changed. This could be a rug pull attack. Meaning that the agent has swapped a benign tool with a malicious one.
## Toxic Flow
A toxic flow, is a threat that arises when more benign tools can be used in combinations by an attacker.
<h3 id="TF001">TF001: Data leak toxic flow.</h3>
A Data Leak toxic flow allows the attacker to leak private data from the agent. For it to works, it needs three ingredients:

* An **untrusted output** tool, meaning a tool whose output could be malicious. Eg: fetch information from any web page.
* A **private data** tool, meaning a tool that exposes private data to the Agent. Eg: read a file from the user's machine.
* A **public sink** tool, meaning a tool that the Agent can use to send information back to the attacker. This could mean sending a private message to an arbitrary phone number, or simply make some information public on the internet. Eg: write to a public repo. Eg: send message on whatsapp.

The attack triggers when the agent uses the **untrusted output** tool for any unrelated user task. The output of the tool contains a prompt injection, or a set of malicious instructions that compromise the agent. Once compromised, the agent can use the **private data** tool to fetch user's private data. Finally the compromised agent can leak such data using the **public sink** tool.

**Note**: A single tool can act as **untrusted output**, **private data** and **public sink** at the same time.
<h3 id="TF002">TF002: Destructive toxic flow.</h3>
A Destructive toxic flow allows the attacker to make a permanent damage. For it to works, it needs two ingredients:

* An **untrusted output** tool, meaning a tool whose output could be malicious. Eg: fetch information from any web page.
* A **destructive** tool, meaning a irreversible tool that can be used in a destructive way. Eg: delete a file on the user's machine, or send money.

The attack triggers when the agent uses the **untrusted output** tool for any unrelated user task. The output of the tool contains a prompt injection, or a set of malicious instructions that compromise the agent. Once compromised, the agent can use the **destructive** tool to irreversibly damage the environment.

## Analysis Error
Analysis Error imply something went wrong during the scan. The mcp servers are not being scanned as expected.
<h3 id="X001">X001: Could not reach analysis server</h3>
The backend of `mcp-scan` could not be reached. This might be caused by:

* The `mcp-scan` backend is currently down
* You selected the manually the backend using `--base-url` flag, and the backend you selected cannot be reached.
* No internet connection
<h3 id="X002">X002: Whitelisted</h3>
The tool has been whitelisted. It will now show in green even if issuer are detected.