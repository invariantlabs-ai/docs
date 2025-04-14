import os
import re
from pathlib import Path

FRONTMATTER_PATTERN = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
TITLE_PATTERN = re.compile(r"^# (.+)", re.MULTILINE)
SUBTITLE_PATTERN = re.compile(r"<div class='subtitle'>(.*?)</div>", re.DOTALL)


def extract_or_insert_frontmatter(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if FRONTMATTER_PATTERN.match(content):
        return  # Already has frontmatter

    title_match = TITLE_PATTERN.search(content)
    subtitle_match = SUBTITLE_PATTERN.search(content)

    if not title_match or not subtitle_match:
        print(f"Skipping {filepath}, missing title or subtitle")
        return

    title = title_match.group(1).strip()
    subtitle = subtitle_match.group(1).strip()

    frontmatter = f"""---
title: {title}
description: {subtitle}
---\n\n"""

    new_content = frontmatter + content
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Inserted frontmatter into {filepath}")


def traverse_docs_and_process():
    docs_path = Path("./docs")
    for md_file in docs_path.rglob("*.md"):
        extract_or_insert_frontmatter(md_file)


if __name__ == "__main__":
    traverse_docs_and_process()
