---
title: Secret Tokens and Credentials
---

# Secret Tokens and Credentials
<div class='subtitle'>
Prevent agents from leaking sensitive keys, tokens, and credentials.
</div>

Agentic systems often operate on user data, call APIs, or interface with tools and environments that require access credentials. If not adequately guarded, these credentials — such as API keys, access tokens, or database secrets — can be accidentally exposed through system outputs, logs, or responses to user prompts.

This section describes how to detect and prevent the unintentional disclosure of secret tokens and credentials during agent execution.

<div class='risks'/> 
> **Secret Tokens and Credentials Risks**<br/> 
> Without safeguards, agents may: 

> * Leak **API keys**, **access tokens**, or **environment secrets** in responses. 

> * Use user tokens in unintended ways, such as invoking third-party APIs.

> * Enable **unauthorized access** to protected systems or data sources.

Guardrails provide the `secrets` function that allows for detection of tokens and credentials in text, allowing you to mitigate these risks.

## secrets <span class="detector-badge"></span>
```python
def secrets(
    data: Union[str, List[str]]
) -> List[str]
```
This detector will detect secrets, tokens, and credentials in text and return a list of the types of secrets found. 

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `Union[str, List[str]]` |  A single message or a list of messages. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `List[str]` |  List of detected secret types: `["GITHUB_TOKEN", "AWS_ACCESS_KEY", "AZURE_STORAGE_KEY", "SLACK_TOKEN"]`. |

### Detecting secrets
A straightforward application of the `secrets` detector is to apply it to the content of any message, as seen here.

**Example:** Detecting secrets in any message
```python
from invariant.detectors import secrets

raise "Found Secrets" if:
    (msg: Message)
    any(secrets(msg))
```
<div class="code-caption">Raises an error if any secret token or credential is detected in the message content.</div>



### Detecting specific secret types
In some cases, you may want to detect only certain types of secrets—such as API keys for a particular service. Since the `secrets` detector returns a list of all matched secret types, you can check whether a specific type is present in the trace and handle it accordingly.

**Example:** Detecting a GitHub token in messages
```python
from invariant.detectors import secrets

raise "Found Secrets" if:
    (msg: Message)
    "GITHUB_TOKEN" in secrets(msg)
```
<div class="code-caption">Specifically check for GitHub tokens in any message.</div>
