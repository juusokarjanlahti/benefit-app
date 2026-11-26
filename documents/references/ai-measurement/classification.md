# Source classifications and Benefit mappings

C01-C06 paraphrase INTRO. Its PDF metadata dates to 2008, before the supplied 2014
guides; these descriptions are teaching aids, not proof of ISO-edition compliance.
The source distinguishes 28 types; this checkout exposes 27 selectable options.
Mapping is based on `frontend/src/lib/fc-constants.ts`; wording differences are
recorded here rather than changing the source terminology.

## C01: Interactive end-user navigation and query service

INTRO pp. 11-17. Identify the user service rather than treating every control as
an independent BFC. Apply GUI rules to counted elements and shared functions.

| Source type          | Identifying service                                       | Benefit componentType    |
| -------------------- | --------------------------------------------------------- | ------------------------ |
| q1 Icon              | Starts a service or application                           | function designators     |
| q2 Login/logout      | Controls user access                                      | log-in log-out functions |
| q3 Menu              | Selects next task or destination                          | function lists           |
| q4 Selection list    | Offers acceptable parameter values                        | selection lists          |
| q5 Data inquiry      | Shows details from data stores                            | data inquiries           |
| q6 Generation dialog | Initiates a report or manipulation subprocess             | generation indicators    |
| q7 Browsing list     | Shows similar records for filtering or inspecting details | browsing lists           |

## C02: Interactive end-user input service

INTRO pp. 19-22. Multiplier counts the supported create/update/delete maintenance
actions, not the number of buttons, fields or database writes.

| Source type | Maintenance actions         | Benefit componentType |
| ----------- | --------------------------- | --------------------- |
| i1          | One of create/update/delete | 1-functional          |
| i2          | Two of create/update/delete | 2-functional          |
| i3          | All three                   | 3-functional          |

## C03: Non-interactive end-user output service

INTRO pp. 24-28. Preserve this distinction from the screen that initiates output.
A screenshot of a report does not by itself establish whether the source layout
is fixed or varies with the data.

| Source type           | Identifying service                                         | Benefit componentType                     |
| --------------------- | ----------------------------------------------------------- | ----------------------------------------- |
| o1 Form               | Printed/displayed document with fixed layout, e.g. receipt  | forms                                     |
| o2 Report             | Layout can vary with data within a specified framework      | No exact supported option; review mapping |
| o3 Email/text message | Electronically transmitted output document                  | emails for text messages                  |
| o4 Monitor            | Continually displayed information updated with data changes | monitor screens                           |

## C04: Interfaces to/from other applications

INTRO pp. 30-38. Use direction relative to the measured application's boundary.
A task saying only “integrate” does not determine direction, payload or references.

| Source type | Service                                 | Benefit componentType                      |
| ----------- | --------------------------------------- | ------------------------------------------ |
| t1          | Outgoing online message                 | messages to other applications             |
| t2          | Outgoing batch transfer records         | batch records to other applications        |
| t3          | Outgoing signal to device/application   | signals to devices or other applications   |
| f1          | Incoming online message                 | messages from other applications           |
| f2          | Incoming batch transfer records         | batch records from other applications      |
| f3          | Incoming signal from device/application | signals from devices or other applications |

Class names are respectively `Interface service to other applications` and
`Interface service from other applications`. M08 prohibits borrowing internal
multilayer defaults for an external integration without supporting evidence.

## C05: Data storage service

INTRO pp. 40-42. Persistent logical information relevant to the user, not simply
one function per physical database object. The example FP labels on pp. 41-42
are disputed; the type descriptions and formula audit remain separately usable.

| Source type | Service                             | Benefit componentType |
| ----------- | ----------------------------------- | --------------------- |
| d1          | Persistent logical entities/classes | entities or classes   |
| d2          | Other persistent logical records    | other record types    |

## C06: Algorithmic or manipulation service

INTRO pp. 44-50. A distinct specified functional routine must be identified;
ordinary technical implementation details are not automatically additional BFCs.
An explicitly required security algorithm can be a functional service; this does
not make every security/quality constraint a separately counted routine.

| Source type | Service                                          | Benefit componentType       |
| ----------- | ------------------------------------------------ | --------------------------- |
| a1          | Specified security algorithm, such as encryption | security routines           |
| a2          | Arithmetic/logical calculation routine           | calculation routines        |
| a3          | Simulation calculation                           | simulation routines         |
| a4          | Special format conversion beyond simple editing  | formatting routines         |
| a5          | User-defined data maintenance rules              | database cleaning routines  |
| a6          | Other independently specified manipulation       | other manipulation routines |

Operations need explicit counting evidence. A “reading reference” in the p. 50
caption is not an operation count. No complete operation-counting methodology is
established by this introduction alone; retain Q07 and Q11.
