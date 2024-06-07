# cdp-example-node-backend

Core delivery platform Node.js Backend example.

Based on the CDP template https://github.com/DEFRA/cdp-node-backend-template

---

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Development](#development)
    - [Updating dependencies](#updating-dependencies)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
- [API endpoints](#api-endpoints)
- [Calling API endpoints](#calling-api-endpoints)
  - [Postman](#postman)
- [Docker](#docker)
  - [Development Image](#development-image)
  - [Production Image](#production-image)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

![Publish workflow](https://github.com/github/docs/actions/workflows/publish.yml/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_cdp-example-node-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_cdp-example-node-backend)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v18` and [npm](https://nodejs.org/) `>= v9`. You will find it
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

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

#### Updating dependencies

To update dependencies, globally install https://www.npmjs.com/package/npm-check-updates. Then run the below script,
run tests, test the application and commit the altered `package.json` and `package-lock.json` files. For more
options around updates check the package docs.

```bash
ncu -i
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

## API endpoints

| Endpoint                       | Description  |
| :----------------------------- | :----------- |
| `GET: /health`                 | Health       |
| `GET: /v1/entities`            | Entities     |
| `GET: /v1/entities/<entityId>` | Entity by ID |

## Calling API endpoints

### Postman

A [Postman](https://www.postman.com/) collection and environment are available for making calls to the Teams and
Repositories API. Simply import the collection and environment into Postman.

- [CDP Node Backend Template Postman Collection](postman/cdp-example-node-backend.postman_collection.json)
- [CDP Node Backend Template Postman Environment](postman/cdp-example-node-backend.postman_environment.json)

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag cdp-example-node-backend:development .
```

Run:

```bash
docker run -e GITHUB_API_TOKEN -p 3008:3008 cdp-example-node-backend:development
```

### Production image

Build:

```bash
docker build --no-cache --tag cdp-example-node-backend .
```

Run:

```bash
docker run -e GITHUB_API_TOKEN -p 3001:3001 cdp-example-node-backend
```

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
