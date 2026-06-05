# Community Requests

Community Requests is a small request queue for a local community centre. Staff
can review room, equipment, accessibility and general enquiries from residents,
see the current status of each request, and spot items that need a reply.

The project uses seeded data and does not need a database. It is intended as a
lightweight local app that can be run, changed and reset quickly.

## Folder layout

- `api/CommunityRequests.Api`: .NET 8 API with seeded request data.
- `web`: Next.js frontend for the request queue.

## Run the API

From the repository root:

```bash
dotnet run --project api/CommunityRequests.Api/CommunityRequests.Api.csproj --urls http://localhost:5087
```

Check the API:

```bash
curl http://localhost:5087/health
curl http://localhost:5087/api/requests
```

## Run the frontend

Install the frontend dependencies and start the development server:

```bash
npm --prefix web install
npm --prefix web run dev
```

Open `http://localhost:3607`.

The frontend expects the API at `http://localhost:5087`. To use a different API
URL, set `NEXT_PUBLIC_REQUEST_API_URL` before starting the frontend:

```bash
NEXT_PUBLIC_REQUEST_API_URL=http://localhost:5087 npm --prefix web run dev
```

## Checks

Run the frontend checks:

```bash
npm --prefix web run typecheck
npm --prefix web test
```

Build the API:

```bash
dotnet build api/CommunityRequests.Api/CommunityRequests.Api.csproj
```

## Development notes

The API CORS policy allows the local frontend at `http://localhost:3607`.

Seed data lives in `api/CommunityRequests.Api/Data/RequestSeedData.cs`. Frontend
request loading and triage helpers live in `web/src/lib`.
