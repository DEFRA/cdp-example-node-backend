# cdp-example-node-backend

Core delivery platform Node.js Backend example.

Based on the CDP template https://github.com/DEFRA/cdp-node-backend-template.

![Publish workflow](https://github.com/DEFRA/cdp-example-node-backend/actions/workflows/publish.yml/badge.svg)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_cdp-example-node-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_cdp-example-node-backend)

---

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Git hooks](#git-hooks)
  - [Development](#development)
  - [Testing](#testing)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
  - [Updating dependencies](#updating-dependencies)
  - [Formatting](#formatting)
    - [Windows prettier issue](#windows-prettier-issue)
- [API endpoints](#api-endpoints)
- [Development helpers](#development-helpers)
  - [MongoDB Locks](#mongodb-locks)
  - [Proxy](#proxy)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
  - [Docker Compose](#docker-compose)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v24` and [npm](https://nodejs.org/) `>= v11`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd cdp-example-node-backend
nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
npm install
```

The service needs MongoDB. Start it (and the other local dependencies) with [Docker Compose](#docker-compose):

```bash
docker compose up -d mongodb
```

### Git hooks

Install git hooks (optional)

```bash
npm run setup:husky
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

The service listens on http://localhost:3049.

### Testing

To test the application run:

```bash
npm run test
```

Tests use an in-memory MongoDB ([vitest-mongodb](https://www.npmjs.com/package/vitest-mongodb)), so they do not need
Docker.

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json).
To view them in your command line run:

```bash
npm run
```

### Updating dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

Run the tests, test the application and commit the altered `package.json` and `package-lock.json` files.

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## API endpoints

| Endpoint                                                 | Description                                                     |
| :------------------------------------------------------- | :-------------------------------------------------------------- |
| `GET: /health`                                           | Health                                                          |
| `GET, POST: /animals`                                    | List or create animals                                          |
| `GET: /animals/<animalId>`                               | Animal by ID                                                    |
| `GET, POST: /plants`                                     | List or create plants                                           |
| `GET: /plants/<plantId>`                                 | Plant by ID                                                     |
| `GET, POST: /creatures`                                  | List or create creatures                                        |
| `GET, DELETE: /creatures/<creatureId>`                   | Get or delete a creature                                        |
| `POST: /birds/<birdId>/tracking`                         | Create a bird tracking                                          |
| `GET: /birds/<birdId>/trackings`                         | Trackings for a bird                                            |
| `GET: /birds/<birdId>/tracking/<trackingId>`             | Tracking by ID (simulates processing)                           |
| `POST: /birds/<birdId>/tracking/<trackingId>/callback`   | Upload callback for a tracking                                  |
| `POST: /birds/<birdId>/tracking/<trackingId>/status-url` | Set the status URL of a tracking                                |
| `POST: /callback`                                        | Logs the callback payload                                       |
| `/api/*`                                                 | Test endpoints, see [example-api.md](src/routes/example-api.md) |

## Development helpers

### MongoDB Locks

If you require a write lock for Mongo you can acquire it via `server.locker` or `request.locker`:

```javascript
async function doStuff(server) {
  const lock = await server.locker.lock('unique-resource-name')

  if (!lock) {
    // Lock unavailable
    return
  }

  try {
    // do stuff
  } finally {
    await lock.free()
  }
}
```

Keep it small and atomic.

Helper methods are also available in `/src/common/helpers/mongo-lock.js`.

### Proxy

We are using forward-proxy which is set up by default. Services are automatically configured with the proxy environment
variables when deployed.

Node.js 24 uses these variables to route outbound HTTP(S) requests through the proxy:

NODE_USE_ENV_PROXY=1
HTTPS_PROXY=...
NO_PROXY=...

No additional proxy configuration is required in the service.

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag cdp-example-node-backend:development .
```

Run:

```bash
docker run -p 3049:3049 -e PORT=3049 cdp-example-node-backend:development
```

### Production image

Build:

```bash
docker build --no-cache --tag cdp-example-node-backend .
```

Run:

```bash
docker run -p 3049:3049 -e PORT=3049 cdp-example-node-backend
```

### Docker Compose

A local environment with:

- Floci for AWS services (S3, SQS, SNS etc)
- Redis
- MongoDB
- This service.

```bash
docker compose up --build -d
```

Mock AWS resources can be created when Floci starts up by editing the scripts in `./compose/floci/start.d/`.
MongoDB records can also be created when Mongo starts by editing the scripts in `./compose/mongo/`.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
