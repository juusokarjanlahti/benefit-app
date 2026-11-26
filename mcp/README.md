# FiSMA Benefit MCP server

Use a local MCP client to read saved FiSMA 1.1 calculations from a running
Benefit backend. The server uses stdio and reads data with your Benefit
account's existing project permissions.

| Tool                          | Result                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `list_projects`               | Project names, IDs, dates, and version numbers, including archived versions                |
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
