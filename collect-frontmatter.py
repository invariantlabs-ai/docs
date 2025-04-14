import os
import re
import yaml
from pathlib import Path
import json

FRONTMATTER_PATTERN = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def parse_frontmatter(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return None

    try:
        frontmatter = yaml.safe_load(match.group(1))
        return {
            "title": frontmatter.get("title", ""),
            "description": frontmatter.get("description", ""),
        }
    except yaml.YAMLError:
        print(f"Failed to parse YAML in {filepath}")
        return None


def collect_frontmatter_data():
    data = {}
    docs_path = Path("./docs")
    for md_file in docs_path.rglob("*.md"):
        parsed = parse_frontmatter(md_file)
        if parsed:
            data[str(md_file)] = parsed
    return data


if __name__ == "__main__":
    result = collect_frontmatter_data()
    print(json.dumps(result, indent=2))
