import re
import json


def on_page_markdown(markdown, page, config, files):
    markdown = markdown.replace("```trace", "```json {.language-trace}")
    markdown = markdown.replace("```guardrail", "```python {.language-guardrail}")
    markdown = markdown.replace(
        "```example-trace", "```python {.language-example-trace}"
    )

    return markdown
