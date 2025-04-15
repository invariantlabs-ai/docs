# Regex Filters

<div class='subtitle'>Use regular expressions to filter messages</div>

One simple, yet effective method to constrain your agent is to apply regular expressions to match undesired content and substrings.

This is a powerful tool, specifically to fight plain text risks, e.g. to prevent certain URLs, names or other patterns from being included in the agent's context.


!!! danger "Plain Text Content Risks"
    Agents that operate on plain text content are suceptible to generating harmful, or misleading content, which you as the operator may be liable for. An insecure agent could:

    - Generate phishing URLs that are advertised under your brand authority
    - Reference competitors or their websites in responses and internal reasoning
    - Produce content in unsupported output formats, leading to visual defects in your application
    - Use URL smuggling to bypass security measures (e.g. to leak information via URLs) 

    
    

## match <span class="builtin-badge"/>
```python
def match(
    pattern: str, 
    content: str
) -> bool
```
Detector to match a regular expression pattern in a message.

**Parameters**

| Name        | Type   | Description                            |
|-------------|--------|----------------------------------------|
| `pattern`    | `str`  | The regular expression pattern to match. |
| `content`    | `str`  | The content to match the pattern against. |

**Returns**

Returns `True` if the pattern matches the content, `False` otherwise.

Wraps `re.match` from Python's standard library. 

By default only matches content at the beginning of the string. To match anywhere in the string, use `.*` at the beginning of the pattern.

### Examples

**Example:** Checking if a message contains a URL.

```guardrail
raise "Must not link to example.com" if:
    (msg: Message)
    match("https?://[^\s]+", msg.content)
```
```example-trace
[
  {
    "role": "user",
    "content": "Respond with http://example.com"
  },
  {
    "role": "assistant",
    "content": "http://example.com"
  }
]
```

**Example:** Checking if a message contains a competitor's name.

```guardrail
raise "Must not mention competitor" if:
    (msg: Message)
    match(".*[Cc]ompetitor.*", msg.content)
```
```example-trace
[
  {
    "role": "user",
    "content": "What do you think about competitor?"
  },
  {
    "role": "assistant",
    "content": "I dont' know what you are talking about"
  }
]
```


## find <span class="builtin-badge"/>
```python
def find(
    pattern: str, 
    content: str
) -> List[str]
```

Detector to find all occurrences of a regular expression pattern in a message.

**Parameters**

| Name         | Type   | Description                            |
|--------------|--------|----------------------------------------|
| `pattern`    | `str`  | The regular expression pattern to find.|
| `content`    | `str`  | The content to find the pattern in.    |

**Returns**

The list of all occurrences of the pattern in the content.

### Examples

**Example:** Iterating over all capitalized words and checking if they are in a list of names.

```guardrail
raise "must not send emails to anyone but 'Peter' after seeing the inbox" if:
    (msg: Message)
    (name: str) in find("[A-Z][a-z]*", msg.content)
    name in ["Peter", "Alice", "John"]
```
```example-trace
[
  {
    "role": "user",
    "content": "Reply to Peter's message and then Alice's"
  }
]
```

**Example:** Checking all URLs in a message
```guardrail
raise "Must not link to example.com" if:
    (msg: Message)
    (url: str) in find("https?://[^\s]+", msg.content)
    url in ["http://example.com", "https://example.com"]
```
```example-trace
[
  {
    "role": "user",
    "content": "Go to http://example.com and then https://secure-example.com"
  }
]
```

Here, we quantify over all matches returned by `find`. This means, if any of the matches satisfies the extra condition, the guardrail will raise. 