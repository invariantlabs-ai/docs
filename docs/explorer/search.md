---
title: Search
description: Use Explorer Search to quickly find and filter traces
---

# Search

<div class='subtitle'>Use Explorer Search to quickly find and filter traces</div>

Often, there is a large number of traces in the dataset. In this chapter, we describe how to search over these traces efficiently and filter them according to different criteria. 

For instance, searching for `maps` would return all traces containing the word `maps` somewhere in the trace.

<img src="../assets/search.png" class="img-fluid" alt="Search bar in the Invariant Explorer">

## Exact search

The simplest form of search is an exact search which searches for exact string (but case-insensitively) in the trace.

For instance the term `maps` queries for traces containing the word `maps`, `Maps`, `MAPS`, etc.

## Filtered Search

Separately from exact search, any white-space-separated token containing a `:` is interpreted as a filter. 
There are several types of filters:

- `is:annotated`
    - filters for traces with annotations
- `not:annotated`
    - filters for traces without annotations
- `meta`
    - searches for traces with the corresponding metadata
    - attribute is a string identifying one of the attributes in the meta data (**case sensitive**)
    - operator is one of
        - `=`, `==` - exact match
            - e.g. `meta:title=foo`
        - `<` , `>`, `<=` , `>=` - numerical comparison
            - e.g. `meta:tests_passed>3`
        - `%` - string containment
            - e.g. `meta:title%react`
- `is:invariant`
    - groups traces by type of error detected by the invariant analyzer
