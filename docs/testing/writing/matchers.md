# Matchers

<div class='subtitle'>Test with custom checkers and LLM-based evaluation</div>

Not all agentic behavior can be specified with precise, traditional checking methods. Instead, more often than not, we expect AI models to generalize and thus respond slightly differently everytime we invoke them.

To accommodate this, `testing` includes several different `Matcher` implementations, that allow you to write tests that rely on fuzzy, similarity-based or property-based conditions.

Beyond that, `Matcher` is also a simple base class that allows you to write your own custom matchers, if the provided ones are not sufficient for your needs (e.g. custom properties).

## [`IsSimilar`](https://github.com/invariantlabs-ai/invariant/blob/main/testing/invariant/custom_types/matchers.py#L53)

Checks if a string is similar to an expected string by checking if the similary score reaches a given threshold.

## [`LambdaMatcher`](https://github.com/invariantlabs-ai/invariant/blob/main/testing/invariant/custom_types/matchers.py#L18)

Matcher for checking if a lambda function returns True on the underlying value. This can be useful to check for custom properties of outputs, while maintaining [addresses to localize failing](./tests.md) assertions.

## [`IsFactuallyEqual`](https://github.com/invariantlabs-ai/invariant/blob/main/testing/invariant/custom_types/matchers.py#L86)

Checks for factual equality / entailment of two sentences or words. This can be used to check if two sentences are factually equivalent, or subset/superset of each other.

## [`ContainsImage`](https://github.com/invariantlabs-ai/invariant/blob/main/testing/invariant/custom_types/matchers.py#L153)

Checks if the input contains an image in base64 encoding.