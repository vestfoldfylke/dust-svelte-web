# D.U.S.T (Debug Status User tool)

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

> [!IMPORTANT]  
> [./src/routes/+layout.js](./src/routes/+layout.js) is set with `export const ssr = false` - Which disables server-side-rendering, and ultimately turns the entire project into an SPA (single page application). This can cause some side-effects when trying to use built-in SvelteKit features, so be aware of *when and where* stuff will run when your components mounts/loads/are destroyed/unloads.

## Description
Frontend for D.U.S.T 🥸

A simple SvelteKit frontend where users can search for, and genereate debug reports for other users. Searchable users come from mongodb-collection which has to be maintained by some other job [see DUSTE-KVERNAs update-db-users](https://github.com/vestfoldfylke/duste-kvern/tree/main/scripts/update-db-users)

**Flow**
- User is logged in
- User searchs for another user to debug, and selects it from a dropdown in the searchbar
- On selection, a report is generated in mongodb through API-call to [DUST-API](https://github.com/vestfoldfylke/azf-dust-api-v2)
- User is navigated to /report/{id-of-generated-report}
- Browser/client polls the report with setInterval every given ms
  - If 202 - continue polling
  - If 200 - report is complete
- [DUSTE-KVERNA](https://github.com/vestfoldfylke/duste-kvern) continuously polls mongodb for new reports and handles all data-fetching / testing, and updates the report in mongodb

## Easter eggs
- legg til U foran FINT når FINT feiler
- Legg til noe rart på visse brukere

## Developing

Once you've cloned or forked the repo and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

### Create .env file
#### Pure mock-site (no API or MSAL-auth)
```bash
# For purely frontend development - only these are required in .env (mock-data must be maintained when changes happen in the API)
VITE_MOCK_MSAL="true"
VITE_MOCK_API="true"
```

#### With API and MSAL-auth
```bash
VITE_CLIENT_ID="{client id for app registraton}"
VITE_CLIENT_ISS="https://login.microsoftonline.com/{tenant id where the app registration resides}"
VITE_REDIRECT_URI="http://localhost:5173" # For local development
VITE_LOGOUT_URI="https://{wherever you want to send after logout}.com"
VITE_DUST_API_URI="http://localhost:7071/api" # Url for API (either locally or remote running) - remember CORS-settings on the API
VITE_DUST_API_SCOPE="{scope_prefix}/user_impersonation" # user_impersonation SCOPE for the API
VITE_MOCK_MSAL="false" # Set to true for mocking auth (API must be run locally as well if using this, and not using VITE_MOCK_API)
VITE_MOCK_API="false" # Set to true if you want to mock API as well (all handled in client-browser)
VITE_ALERT_RUNTIME_MS=30000 # How long a system's runtime must have run to show up as alerts (ms). Default is 30s (30000ms)
```

#### Start dev
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building
To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
