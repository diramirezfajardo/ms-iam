## Description

nestjs-backend is a template to generate backend based in NestJS

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Migrations

We have 3 commands to work with migration

1. **migration:create**: Used to create a new migration

```shell
# sintax
npm run migration:create MigrationName

# e.g
npm run migration:create CreateUser
```

2. **migration:run**: Used to run migrations

```shell
npm run migration:run
```

3. **migraton:revert**: Used to revert migrations

```shell
npm run migration:revert
```

### Create New Endpoint

```shell
nest g resource http/endpoints/{name}
```
