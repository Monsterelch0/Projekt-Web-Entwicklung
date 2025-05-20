# Casino Frontend

React app with Vite.

### Developing

This project uses `pnpm` as package manager, which doesn't ship with node.js by default. To install it, run:
```sh
npm install -g pnpm
```

Assuming you have already cloned the repository and are in the `frontend/` directory, first download the project's dependencies:
```sh
pnpm install
```

Then, to start a local web server simply run:
```sh
pnpm dev
```

This will run the app at http://localhost:5173/. When editing code, the page will automatically refresh to reflect the changes.

### Setting the API URL

By default the frontend expects the API server to be available at `http://localhost:5000`. To change this, create a file called `.env.local` in the root of the `frontend/` directory like this:

```bash
VITE_API_URL=http://backend.example:12345
```
