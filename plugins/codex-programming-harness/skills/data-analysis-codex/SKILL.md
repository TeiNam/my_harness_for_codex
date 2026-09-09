---
name: data-analysis-codex
description: Analyze datasets, metric changes, cohorts, funnels, or experiments with reproducible queries or Python. Use for analytical conclusions; spreadsheet formatting alone is outside this skill.
---

# Data Analysis

Connect a defined question to a reproducible result.

1. State the decision or exploratory question, population, period, unit of observation, and metric denominator. Resolve consequential ambiguity; otherwise state a working assumption.
2. Inspect schema, row counts, missing values, duplicates, ranges, and join cardinality before interpreting aggregates. Preserve raw inputs.
3. Use the existing analysis stack. Small standard-library scripts may suffice; use installed pandas, Polars, or DuckDB where their operations fit. Select columns and filter early when memory matters.
4. Make identifiers, null handling, units, and time zones explicit. Keep business-day and cohort boundaries in the defined business time zone; do not shift calendar groupings by blindly converting everything to UTC.
5. Match the method to the question. Summarize distributions for description, decompose changes by segment for diagnosis, and check assignment and confounding before making causal claims.
6. Validate the result with a small independent calculation or known slice. Check that joins did not multiply observations and totals reconcile after filters.
7. Rerun the script or notebook from a clean state. Record input provenance, assumptions, transformations, and enough environment information to reproduce the result.

## Interpretation

- Report the denominator and sample size with rates. For cohorts and funnels, define membership, event order, and the observation window.
- Compare like periods and examine seasonality and segment mix before attributing a trend.
- Distinguish an observational association from an intervention's effect.
- For experiments, inspect the randomization unit, allocation, exclusions, missing outcomes, multiple comparisons, and stopping rule. Report effect size and uncertainty, not only a p-value.
- Separate a statistically detectable effect from one that matters to the user's decision.

Use labeled axes, units, and honest scales. For Korean figures, choose an available font with Korean glyphs and inspect the rendered output.

Deliver the finding, supporting calculation or chart, reproducible artifact, and material limitations. Add caches or scheduled pipelines only when repeated work justifies them.
