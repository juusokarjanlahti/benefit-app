# FiSMA Benefit MCP server

Use a local MCP client to read and create saved FiSMA 1.1 calculations on a running
Benefit backend. The server uses stdio and reads data with your Benefit
account's existing project permissions.

| Tool                          | Result                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `list_projects`               | Project names, IDs, dates, and version numbers, including archived versions                |
| `create_project`              | Create an empty version-1 project owned by the configured account                          |
| `add_component`               | Append a non-multilayer component to an owned, editable project                            |
| `get_project`                 | A specific version and its functional components and subcomponents                         |
| `get_project_function_points` | Actual and possible function points, both including and excluding multilayer subcomponents |

Actual points account for each component's degree of completion. Possible
points represent 100% completion. The totals use the same calculation functions
as the Benefit web app.

## Setup

1. Install Node.js 22 or newer. Start a [local Benefit backend](../README.md#setting-up-development-environment) or use the HTTPS URL of a running Benefit backend.
2. From the repository root, run:

   ```sh
   npm --prefix mcp ci
   npm --prefix mcp run build
   ```

3. Get a JWT from that backend using the [Benefit sign-in instructions](../documents/references/api.md#sign-in-and-fetch-projects).
   Put the token value in a private environment file outside the repository, without the `Bearer ` prefix.

   ```dotenv
   BENEFIT_API_URL=http://localhost:8080
   BENEFIT_TOKEN=replace-with-your-jwt
   ```

   `BENEFIT_API_URL` defaults to `http://localhost:8080`. Use HTTPS for
   a backend outside your machine. Update the environment file and restart
   the MCP server when the JWT expires.

4. Register the built server in a stdio-capable client. In clients that use the
   `mcpServers` format, replace both paths with your absolute paths:

   ```json
   {
     "mcpServers": {
       "fisma-benefit": {
         "command": "node",
         "args": [
           "--env-file=/absolute/path/to/benefit-mcp.env",
           "/absolute/path/to/benefit-app/mcp/dist/server.mjs"
         ]
       }
     }
   }
   ```

   If the client can't find Node.js, use the absolute path to the `node` executable.

Try asking your client to list the Benefit projects it can access, then compare
the actual and possible function points for a project version. Each version has
its own project ID.

## Creating a project and components

Call `create_project` with `projectName`, then `add_component` with the returned
`projectId` and a `component` object. The component needs a title, a supported
class/type pair, `degreeOfCompletion` from 0 to 1, and the numeric inputs for
that class (matching the web app). Interactive input services also require a
positive `functionalMultiplier`. The schema lists supported types and fields.

For example, use class `Data storage service`, type `entities or classes`,
title `Customers`, `dataElements: 6`, and `degreeOfCompletion: 1`. Check the
saved result with `get_project` and `get_project_function_points`, then refresh
the project list in the web app signed in as the same account.

These tools save data immediately using existing account permissions. They
are not idempotent and never retry automatically. If a write times out, inspect
`list_projects` or `get_project` before retrying to avoid duplicates. Component
creation supports top-level, non-multilayer components. Editing, deleting, and
creating multilayer trees are not exposed.

## Local checks

Run `npm --prefix mcp test` to build and check the MCP over stdio against a temporary
local test API. The tests use a fake token and do not touch saved Benefit projects.
