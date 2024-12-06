# Matchers

<div class='subtitle'>Test with custom checkers and LLM-based evaluation</div>

Not all agentic behavior can be specified with precise, traditional checking methods. Instead, more often than not, we expect AI models to generalize and thus respond slightly differently everytime we invoke them.

To accommodate this, `testing` includes several different `Matcher` implementations, that allow you to write tests that rely on fuzzy, similarity-based or property-based conditions.

Beyond that, `Matcher` is also a simple base class that allows you to write your own custom matchers, if the provided ones are not sufficient for your needs (e.g. custom properties).

## `IsSimilar`

TODO

## `LambdaMatcher`

TODO

## `IsFactuallyEqual`

Checks for factual equality / entailment of two sentences or words. This can be used to check if two sentences are factually equivalent, or subset/superset of each other.

TODO