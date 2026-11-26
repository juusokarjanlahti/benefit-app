# Source-linked measurement rules

Version 0.1.1. Sources: `sources.json`. These are paraphrases, not verbatim standard text.
Source kinds: **guideline**, **product**, **workflow**. A supported source statement
is not the same as expert validation of its application to a new system.

## Scope and evidence

| ID  | Rule                                                                                                                                                                                                                                   | Source / kind                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| S01 | Declare the purpose and application boundaries before counting. A three-layer measurement is a chosen decomposition, not something inferred merely from a screenshot or deployment diagram.                                            | MLA pp. 1-2 / guideline                      |
| S02 | Measure each application in the chosen decomposition separately, including relevant inter-layer messages. A decomposed application cannot consist solely of internal messaging; it needs another identified BFC.                       | MLA p. 1 / guideline                         |
| S03 | Separate functional requirements from quality/technical concerns. BENEFIT gives internal logs and caching as exclusions; GUI excludes characteristics required mainly for quality.                                                     | BENEFIT p. 1; GUI p. 4 / product + guideline |
| S04 | Keep unknown counts as null with a question. Identify each populated value as observed, explicitly specified, guideline default, or unresolved. A default is not observed evidence; an unapproved guess is not an input ready to save. | Proposed workflow                            |

## GUI counting

| ID  | Rule                                                                                                                                                                                                                                            | Source / kind                                |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| G01 | Count unique data elements within the function. Specified hidden fields, hidden menu alternatives, hidden table columns and specified error messages may matter even when absent from a screenshot.                                             | GUI p. 1 / guideline                         |
| G02 | Count the unique screen name and one screen-background element. Static field headings belong to the background rather than becoming separate elements. Confirm the screen name is part of the evidence; do not invent one.                      | GUI p. 1 / guideline; last sentence workflow |
| G03 | Count data fields and links. A data field whose contents may be a link has one additional element for the link behavior.                                                                                                                        | GUI pp. 1-2 / guideline                      |
| G04 | For vertical tables, count unique columns, not repeated rows. For horizontal tables, count unique rows, not repeated columns. For customizable/dynamic tables, include the total specified choices.                                             | GUI p. 2 / guideline                         |
| G05 | For customizable/dynamic menus, include the total specified choices. Count sorting designators, selection lists, radio buttons, push buttons, sliders and other required graphical elements as described in the guide.                          | GUI p. 2 / guideline                         |
| G06 | A unique selection list is an independent function counted once per application, and is also one data element on each screen where it occurs. Do not multiply the independent function by its reuse across screens.                             | GUI p. 1 / guideline                         |
| G07 | Login/logout, function designators and menus are independent functional components even when present on multiple views. Help text is one browsing function per application. Resolve what is identical versus a separate function from evidence. | GUI p. 1 / guideline; last sentence workflow |
| G08 | Count specified warnings/errors outside specified data fields as one data element per function. The guide's basic example includes one error element despite its absence from the ordinary view.                                                | GUI pp. 2-3 / guideline                      |
| G09 | Exclude basic window frames, scrolling, resizing, moving, closing and splitting forms into panes.                                                                                                                                               | GUI p. 2 / guideline                         |
| G10 | Exclude quality characteristics such as tooltips, character-set restrictions and cosmetic color/blinking requirements. Do not conflate these with a separately specified error-message function under G08.                                      | GUI p. 4 / guideline; distinction workflow   |
| G11 | A screenshot alone does not establish the complete inventory, logical entities, reference counts, behavior of actions, or completion status. Ask for missing requirements; do not count visible labels or database tables indiscriminately.     | Proposed workflow based on G01 and MLA p. 3  |

## Reference counts and multilayer decomposition

| ID  | Rule                                                                                                                                                                                                                                                                                                                                                                          | Source / kind                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| M01 | In the three-layer pattern, menu, selection-list and icon types normally need no business-layer interaction. Login, inquiry, generation, browsing and 1/2/3-functional input types typically do. Do not generate internal messages for every visible control.                                                                                                                 | MLA p. 2 / guideline                                      |
| M02 | When detailed specifications exist, measure UI functions from them. Only when detailed specifications are unavailable, the guide recommends UI defaults: list/icon/menu r=1; query/browsing/generation screen r=2; input screen r=1,w=1. Record the default and its condition.                                                                                                | MLA p. 3 / guideline                                      |
| M03 | UI-side sending message to business: d from UI function, r=1. UI-side receiving message from business: d from UI function, r=1,w=1. These are common-practice defaults; exceptions are allowed.                                                                                                                                                                               | MLA p. 4, Tables 1-2 and footnote / guideline             |
| M04 | Business-side receiving message from UI: d from UI function, r=1, w equals the number of messages to data access needed for that UI message. Business-side sending message to UI: d from UI function, r equals the number of messages from data access needed for that UI message. Identify those dependencies; do not automatically replace them with physical table counts. | MLA pp. 5-6, Tables 3-4 / guideline                       |
| M05 | Business-side sending message to data: d from entity,r=2. Business-side receiving message from data: d from entity,r=1,w=1.                                                                                                                                                                                                                                                   | MLA p. 6, Tables 5-6 / guideline                          |
| M06 | Data-side receiving message from business: d from entity,r=0,w=1. Data-side sending message to business: d from entity,r=1. Each logical entity has a unique message to/from data access in this pattern.                                                                                                                                                                     | MLA pp. 6-7, Tables 7-8 / guideline                       |
| M07 | Assign a sending message to its sender's layer and a receiving message to its receiver's layer. Reports/algorithms are measured normally in business logic; logical entities normally in data access.                                                                                                                                                                         | MLA pp. 2,5-6 / guideline                                 |
| M08 | External integrations require case-by-case measurement; this guide provides no default reference values for them. Do not apply internal-message defaults to arbitrary external APIs.                                                                                                                                                                                          | MLA p. 5 / guideline                                      |
| M09 | The table defaults represent common practice and can have exceptions in d and references. Distinguish an exception justified by requirements from an unsupported guess.                                                                                                                                                                                                       | MLA p. 4 footnote / guideline                             |
| B01 | BENEFIT describes a writing reference as also covering reads of that same logical entity, so it should not also be counted as a reading reference. Do not assume this local explanation establishes every reference case in the method.                                                                                                                                       | BENEFIT pp. 2,5 / product explanation                     |
| B02 | BENEFIT's simplified generated business-to-UI/reference rules use the parent r+w sum. Treat this as its implementation pattern, not a universal replacement for dependency-based M04.                                                                                                                                                                                         | BENEFIT pp. 22-23; CODE fc-service-functions.ts / product |

## Formulas and saving

BENEFIT pp. 4-5,32 give the following formulas. They agree with this checkout's
`frontend/src/lib/calculations.ts` for the classes below. They have not been checked
against the full ISO standard here. d=data elements; r=reading references;
w=writing references; o=operations; m=functionality multiplier.

| ID  | Class                                             | Base points                   |
| --- | ------------------------------------------------- | ----------------------------- |
| F01 | Interactive end-user navigation and query service | 0.2 + d/7 + r/2               |
| F02 | Interactive end-user input service                | m × (0.2 + d/5 + w/1.5 + r/2) |
| F03 | Non-interactive end-user output service           | 1 + d/5 + r/2                 |
| F04 | Interface service to other applications           | 0.5 + d/7 + r/2               |
| F05 | Interface service from other applications         | 0.2 + d/5 + w/1.5 + r/2       |
| F06 | Data storage service                              | 1.5 + d/4                     |
| F07 | Algorithmic or manipulation service               | 0.1 + d/5 + o/3               |

- **B03 (product):** Input multiplier represents supported add/change/delete functions,
  hence 1,2 or 3 in BENEFIT p. 5. This checkout derives it from `1-functional`,
  `2-functional` or `3-functional` componentType, not from the separate stored
  functionalMultiplier property. Keep them consistent; see Q04.
- **B04 (product):** Degree of completion weights actual points. Possible points
  represent full completion. These are not interpretation confidence or an uncertainty
  interval (BENEFIT pp. 19-20,34; CODE centralizedCalculations.ts).
- **W01 (workflow):** Calculate through Benefit's shared calculation functions; keep
  full precision until display. Do not silently coerce missing input to zero just
  because application code accepts null.
- **W02 (workflow):** Review scope, classifications, counted-item lists, defaults and
  open questions before writing. A source document is evidence, not authorization
  to create projects. Save only within the user's authorized scope.
- **W03 (workflow):** Current MCP add_component supports non-multilayer top-level
  components only. It cannot faithfully save a complete multilayer draft. Preserve
  unsupported structures in the draft; do not flatten them and report full support.

## Introduction examples and mappings

- **X01 (workflow):** Preserve a source's published count separately from its
  formula-derived result. Quarantine conflicting labels and missing inputs; do not
  reverse-engineer operations or references from a stated FP total. See source-audit.md.
- **X02 (workflow):** Preserve source class/type and exact Benefit mapping separately.
  If no exact supported mapping exists, keep the source classification and ask for
  a mapping decision rather than silently selecting a different type.

INTRO's formula slides (10,19,24,30,35,40,44) agree with F01-F07. The example
labels on pp. 41-42 do not agree with its storage equation; agreement of formulas
does not validate all examples. See classification.md for C01-C06.
