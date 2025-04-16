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
> Agentic systems are liable to leak credentials and secrets. Without safeguards, agents may: 

> * Leak **API keys**, **access tokens**, or **environment secrets** in responses. 

> * Use user tokens in unintended ways, such as invoking third-party APIs.

> * Enable **unauthorized access** to protected systems or data sources.

Guardrails provide the `secrets` function that allows for the detection of tokens and credentials in text, allowing you to mitigate these risks.

## secrets <span class="detector-badge"></span>
```python
def secrets(
    data: str | list[str]
) -> list[str]
```
This detector will detect secrets, tokens, and credentials in text and return a list of the types of secrets found. 

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `data`      | `str | list[str]` |  A single message or a list of messages. |

**Returns**

| Type   | Description                            |
|--------|----------------------------------------|
| `list[str]` |  List of detected secret types: `["GITHUB_TOKEN", "AWS_ACCESS_KEY", "AZURE_STORAGE_KEY", "SLACK_TOKEN"]`. |

### Detecting secrets
A straightforward application of the `secrets` detector is to apply it to the content of any message, as seen here.

**Example:** Detecting secrets in any message.
```guardrail
from invariant.detectors import secrets

raise "Found secrets" if:
    (msg: Message)
    any(secrets(msg))
```
```example-trace
[
  {
    "role": "assistant",
    "content": "My token is ghp_wWPw5k4aXcaT4fNP0UcnZwJUVFk6LO2rINUx"
  },
  {
    "role": "assistant",
    "content": "My token is AKIAIOSFODNN7EXAMPLE"
  },
  {
    "role": "assistant",
    "content": "My token is AccountKey=lJzRc1YdHaAA2KCNJJ1tkYwF/+mKK6Ygw0NGe170Xu592euJv2wYUtBlV8z+qnlcNQSnIYVTkLWntUO1F8j8rQ=="
  },
  {
    "role": "assistant",
    "content": "My token is xoxb-123456789012-1234567890123-1234567890123-1234567890123"
  },
  {
    "role": "assistant",
    "content": "My invalid token is ghp_wWPw5k4aXcaT4fcnZwJUVFk6LO0pINUx"
  },
  {
    "role": "assistant",
    "content": "My invalid token is AKSAIOSFODNN7EXAMPLE"
  },
  {
    "role": "assistant",
    "content": "My invalid token is AxccountKey=lJzRc1YdHaAA2KCNJJ1tkYwF/+mKK6Ygw0NGe170Xu592euJv2wYUtBlV8z+qnlcNQSnIYVTkLWntUO1F8j8rQ=="
  },
  {
    "role": "assistant",
    "content": "My invalid token is abde-123456789012-1234567890123-1234567890123-1234567890123"
  }
]
```
<div class="code-caption">Raises an error if any secret token or credential is detected in the message content.</div>



### Detecting specific secret types
In some cases, you may want to detect only certain types of secrets—such as API keys for a particular service. Since the `secrets` detector returns a list of all matched secret types, you can check whether a specific type is present in the trace and handle it accordingly.

**Example:** Detecting a GitHub token in messages.
```guardrail
from invariant.detectors import secrets

raise "Found Secrets" if:
    (msg: Message)
    "GITHUB_TOKEN" in secrets(msg)
```
```example-trace
[
  {
    "role": "assistant",
    "content": "My token is ghp_wWPw5k4aXcaT4fNP0UcnZwJUVFk6LO2rINUx"
  },
  {
    "role": "assistant",
    "content": "My token is AKIAIOSFODNN7EXAMPLE"
  },
  {
    "role": "assistant",
    "content": "My token is AccountKey=lJzRc1YdHaAA2KCNJJ1tkYwF/+mKK6Ygw0NGe170Xu592euJv2wYUtBlV8z+qnlcNQSnIYVTkLWntUO1F8j8rQ=="
  },
  {
    "role": "assistant",
    "content": "My token is xoxb-123456789012-1234567890123-1234567890123-1234567890123"
  },
  {
    "role": "assistant",
    "content": "My invalid token is ghp_wWPw5k4aXcaT4fcnZwJUVFk6LO0pINUx"
  },
  {
    "role": "assistant",
    "content": "My invalid token is AKSAIOSFODNN7EXAMPLE"
  },
  {
    "role": "assistant",
    "content": "My invalid token is AxccountKey=lJzRc1YdHaAA2KCNJJ1tkYwF/+mKK6Ygw0NGe170Xu592euJv2wYUtBlV8z+qnlcNQSnIYVTkLWntUO1F8j8rQ=="
  },
  {
    "role": "assistant",
    "content": "My invalid token is abde-123456789012-1234567890123-1234567890123-1234567890123"
  }
]
```
<div class="code-caption">Specifically check for GitHub tokens in any message.</div>
