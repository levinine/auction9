# Auction9 Web Application

## Prerequisites

- Node.js 12+
- AWS cli
- AWS account

## Build

Run `ng build` to build the project. Use the `--prod` flag for a production build or `--qa` for test build.

## Backend

Create 2 environment files. Name `.env.development` and `.env.production`.
`.env.development` - will be used for local connection
`.env.production` - will be used for AWS connection

Inside create variables and add connection parameters:
- MYSQL\_ENDPOINT
- MYSQL\_PORT
- MYSQL\_DATABASE
- MYSQL\_USER
- MYSQL\_PASSWORD

Command to load development environment: `sls offline`
Command to load production environment: `sls offline --env production`
