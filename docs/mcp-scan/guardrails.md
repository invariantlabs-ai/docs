---
title: Guardrails in MCP-Scan
description: Use MCP-scan to ensure your MCP servers are safe to use.
icon: bootstrap/lock
---

# Guardrails in `mcp-scan`

<div class='subtitle'>
Safeguard and restrict your MCP tool calls and responses.
</div>

The `mcp-scan proxy` command supports dynamic guardrailing for MCP servers, letting you enforce safety rules during tool use. It comes with a set of default guardrails and allows you to define custom behavior through a configuration file.

This guide covers how to structure guardrail configs, write custom rules, and apply enforcement at the client, server, and tool levels.

!!! note
    By default, the configuration file is located at `~/.mcp-scan/guardrails-config.yml`.

!!! info "Get Started Directly"
    Just looking to get started quickly? The following example provides a quick way to get started with writing your very own config file. Just copy
    it into your config file and replace the client and server names.
    ```yaml
    <client-name>:  # Replace with a client name (e.g., cursor)
      <server-name>:  # Replace with a server name (e.g., whatsapp)
        guardrails:
          secrets: block

          custom_guardrails:
            - name: "Filter Errors Guardrail"
              id: "error_filter_guardrail"
              action: block
              content: |
                raise "An error was found." if:
                  (msg: Message)
                  "error" in msg.content
    ```

## File structure

The configuration file defines guardrailing behavior hierarchically, scoped by **client**, **server**, and **tool**. Below is a structured overview of the YAML format:

```yaml
<client-name>:
  custom_guardrails:
    ...

  <server-name>:
    guardrails:
      <default-guardrail-name>: <guardrail-action>
        ...

      custom_guardrails: 
        - name: <guardrail-name>
          id: <guardrail-id>
          action: <guardrail-action>
          content: |
            <guardrail-content>
            ...
        
    tools:
      <tool-name>:
        <default-guardrail-name>: <guardrail-action>
        ...
        enabled: <boolean>
    ...
...
```

Each configuration block defines a set of **default**, **custom**, and **tool-level** guardrails for a specific `<client> / <server>` combination (e.g., a client like Cursor and a server like a Git MCP instance).

The ellipses (`...`) in the schema indicate that multiple entries can be added at each level:

- Multiple servers under a single client.

- Multiple guardrails under each guardrails section.

- Multiple tools under a server.

This structure supports flexible, fine-grained control across different environments and toolchains. The sections of the file are described below.


## Default guardrails

Default guardrails are pre-configured and run by default with the `log` action. Alternatively, their behavior can be overridden by specifying `<default-guardrail-name>: <guardrail-action>` as shown above. The following default guardrails exist and can be configured:

| Name        | Requirements   | Description                    |
|-------------|--------|----------------------------------------|
| `links`    | `None`  | Detects links. |
| `secrets`  | `None` | Detects secrets, such as tokens or api keys. |
| `pii`    |  `presidio`, `transformers` | Detects personally identifiable information, such as names, emails, or credit card numbers. |
| `moderated`   |  `ENV: OPENAI_API_KEY`  | Detects content that should be moderated, such as hate speech or explicit content. |


!!! note
    Some default guardrails require optional extra packages to run and are disabled if not installed. You can install them with the argument `--install-extras [list of extras]` to install a specific set of extras or `--install-extras all` to install all extras.


**Example:** Overriding a default guardrail.
```yaml
cursor:
  email-mcp-server:
    guardrails:
      pii: block
      secrets: paused
```

## Custom guardrails
Custom guardrails allow you to define rules tailored to specific workflows, data patterns, or business logic. These guardrails offer flexible semantics and can detect complex or domain-specific behaviors that aren't covered by the built-in defaults.

To get started writing custom rules, refer to the [rule writing reference](./rules.md) to get started quickly with writing guardrails, or explore the rest of this documentation to learn about the concepts in depth, perhaps [starting with this introduction](./index.md).

!!! note
    You can add `custom_guardrails` on either a per-client or a per-server level. If you add it at the client level, the guardrail will be enforced on all servers used by that client.

### Schema
A custom guardrail is defined using the following fields:

| Name        | Type        | Description                            |
|-------------|-------------|----------------------------------------|
| `name`      | `string`    | A name for the guardrail.  |
| `id`        |  `string`   | A unique identifier for the guardrail. |
| `action`    | `Guardrail Action` | The `action` to take when this guardrail is triggered. See below. |
| `content`   | `string`    | A multiline string defining the semantics of this guardrailing rule. Please refer to the rest of this documentation to see how to write guardrails. |

**Example:** Defining a custom guardrail.

Below is a `yaml` fragment that shows how a custom guardrail can be defined to ensure emails are only sent to trusted recipients.
```yaml
...
custom_guardrails:
  - name: "Trusted Recipient Email"
    id: "trusted_email_check"
    action: block
    content: |
      raise "Untrusted email recipient" if:
          (call: ToolCall)
          call is tool:send_email
          not match(".*@company.com", call.function.arguments.recipient)
...
```

## Tool-specific guardrails
Tool-specific guardrails allow you to override or refine guardrailing behavior for individual tools within a given server. This is useful when certain tools require stricter enforcement, relaxed rules, or even complete disabling.


### Schema
The following fields are available for each `tool`:

| Name        | Type        | Description                            |
|-------------|-------------|----------------------------------------|
| `<default-guardrail>` | `Guardrail Action`   | Overrides the behavior of `<default-guardrail>` for this tool specifically. |
| `enabled`   | `boolean`   | Disables tool when set to <span class='boolean-value-false'>False</span>. If this field is not provided, it defaults to <span class='boolean-value-true'>True</span>. |


!!! note
    While the tools section does not allow for defining custom guardrails, you can always use the `call is tool:<tool_name>` syntax to select a specific tool, as shown in the example from the previous section.

**Example:** Disabling and overriding behavior for tools.

The `yaml` fragment below demonstrates how to disable the `send_message` tool and override the behavior for the `secrets` default guardrail to be `block` specifically for the `read_messages` tool.
```yaml
...
tools:
  send_message:
    enabled: false 

  read_messages:
    secrets: block
...
```

## Guardrail actions
Guardrail actions define how the system responds when a guardrail is triggered. These actions let you tailor enforcement severity across different contexts - whether to silently monitor behavior, stop execution entirely, or pause enforcement temporarily.

The following actions are available:

| Name        | Description                            |
|-------------|----------------------------------------|
| `block`     | This will block the client outright, preventing it from executing what triggered the guardrail. |
| `log`       | This lets the client execute what triggered the guardrail, but logs it in the console, so you can monitor the violation patterns without blocking the client's workflow. |
| `paused`    | This pauses the enforcement of the guardrail.  |

These actions are available for both default and custom guardrails.


## Priority of rules
When multiple guardrail rules are defined for the same context (e.g., a default guardrail set at both the server and tool level), the system follows a strict priority hierarchy to determine which rule takes effect.

This ensures predictable behavior and allows for precise control, especially when configuring environments with overlapping scopes.


!!! note
    **Custom guardrails are not subject to this priority system**. Once defined, they are always active and enforced with their specified action, regardless of other configurations.

### Rule Priority (from highest to lowest)
1. **Tool-specific guardrails**  
   Guardrails defined for a specific tool override all other configurations.
2. **Client/server-specific guardrails**  
   Guardrails set at the server level for a particular client are used unless overridden by a tool-specific rule.
3. **Implicit default guardrails**  
   If no explicit rule is defined, the default guardrails apply automatically with the `log` action.

**Example:** A simple config file with overrides.

To see how this hierarchy of precedence works, consider the following example configuration:

```yaml
client:
  server:
    guardrails:
      pii: block
      secrets: paused
        
    tools:
      tool:
        secrets: block
```

The resulting behavior of this configuration is:

- `secrets` is set to block for the `tool`, because tool-specific guardrails have the highest priority.

- For all other tools on `server`, secrets is set to `paused`, as defined at the client/server level.

- For any other client/server combinations not defined in the config, `secrets` will use the implicit default and be set to `log`.

- `pii` is set to block across all tools under `server` due to the client/server setting. For all other combinations, it falls back to the implicit default (`log`).

This precedence ensures that you can enforce strict guardrails where needed, while still benefiting from broad default coverage elsewhere.


## Example file
Below is a complete example of a guardrail configuration file. 
It demonstrates how to define default and custom guardrails for specific clients and servers, apply tool-level overrides, and selectively enable or disable tools

```yaml
cursor:
  email-mcp-server:

    # Customize the guardrailing for this specific server
    guardrails:
      pii: block
      moderated: paused

      # Define multiple custom guardrails
      custom_guardrails:
        - name: "Trusted Recipient Email"
          id: "untrustsed_email_gr_1"
          action: block

          # Guardrail to ensure that we know all recipients
          content: |
            raise "Untrusted email recipient" if:
                (call: ToolCall)
                call is tool:send_email
                not match(".*@company.com", call.function.arguments.recipient)


          # Guardrail to ensure an email is not sent after 
          # a prompt injection is detected in the inbox
        - name: "PII Email"
          id: "untrustsed_email_gr_2"
          action: log
          content: |
            from invariant.detectors import prompt_injection

            raise "Suspicious email before send" if:
                (inbox: ToolOutput) -> (call: ToolCall)
                inbox is tool:get_inbox
                call is tool:send_email
                prompt_injection(inbox.content)

    # Specify the behavior of individual tools
    tools:
      send_message:
        enabled: false

      read_messages:
        secrets: block

  weather:
    guardrails:
      moderated: paused

# Separate configurations on a per client/server basis
claude:
  git-mcp-server:
    tools:
      commit-tool:
        links: paused
```
