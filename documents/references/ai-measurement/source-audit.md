# Introduction example audit

Source: INTRO, 54 physical PDF pages. Metadata creation date: 2008-02-05; no
publication date was established from the title slide. This is a targeted audit,
not an expert certification of every function or every screenshot count.

## Storage labels conflict with the stated equation

INTRO p. 40 states 1.5 + d/4. BENEFIT and this checkout use the same equation.
Pages 41-42 instead publish these labels:

| Source page / item   | Supplied attributes d                     | Published FP | Result of stated equation |
| -------------------- | ----------------------------------------- | ------------ | ------------------------- |
| 41 Person            | 3                                         | 2.1          | 2.25                      |
| 41 Project           | 2                                         | 1.9          | 2.00                      |
| 41 Experiment        | 5                                         | 2.5          | 2.75                      |
| 41 Involved          | 4                                         | 2.3          | 2.50                      |
| 42 Other records     | 6                                         | 2.7          | 3.00                      |
| 43 Sum of these five | 20 total attributes across five functions | 11.5         | 12.50                     |

The published component labels happen to match 1.5+d/5, not the equation printed
on p. 40. This is an arithmetic observation, not a claim about the author's intent
or an official erratum. Preserve both columns; do not promote the published labels
to numeric reference answers or describe the derived column as officially corrected.

## Other issues needing review

- **p. 50:** The algorithmic example supplies 11 data elements and a reading-reference
  caption, but no operation count. The algorithmic formula needs operations. The
  displayed 3.4 FP cannot justify inventing that missing input.
- **p. 51:** The displayed values 2.4+4.0+7.2+5.0+2.6+3.4 sum to 24.6, not the
  printed 24.2. Page 54 uses 24.6. Neither value independently validates p. 50.
- **p. 54:** Its complete-system total includes the disputed storage subtotal and
  rounded component subtotals. It is not accepted as an exact arithmetic benchmark.
- **pp. 9,24-28:** The introduction separates fixed forms and variable-layout reports.
  The current application has no separate Reports type. Preserve that source
  distinction pending a mapping decision, rather than claiming all 28 types are supported.

## Accepted use of unflagged examples

The exercise set uses explicitly supplied numerical inputs from inquiry, input,
output, outgoing-message, incoming-message and calculation-routine examples.
Their arithmetic was recomputed from the printed equations at full precision.
Published one-decimal displays are retained in the worked-example reasons where
appropriate. These checks validate arithmetic given the inputs, not whether the
original screenshots or algorithms were measured completely and correctly.
