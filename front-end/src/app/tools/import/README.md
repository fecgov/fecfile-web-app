# Report import POC

Run the app with its local configuration, activate a committee, and open
**Tools → Import** (`/tools/import`). The existing Tools
route requires committee owner access.

The page selects a single, nonempty CSV up to 10 MiB and uploads its original
bytes. It does not parse the file or simulate an import.

## Provisional API contract

- `POST {environment.apiUrl}{environment.importUploadEndpoint}`
- Default local URL: `http://localhost:8080/api/v1/imports/`
- Body: `multipart/form-data`, with one file field named `file`.
- Uses the existing session credentials and `x-csrftoken` header.
- Success: any JSON response, displayed on the page without assuming ingestion succeeded.
- Failure: HTTP status and any structured JSON error response are displayed.
- HTTP 404/501: an explicit message explains that the endpoint is unavailable.

Change `importUploadEndpoint` through an environment override when the backend
route is chosen. `showImportPrototype` enables both the route and navigation;
it is enabled only in the local configuration by default.

The backend must enforce file constraints, permissions, and validation itself.
Frontend checks only provide feedback before upload. Report parsing, persistence,
background jobs, and confirmation are outside this UI POC.
