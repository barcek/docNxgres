# docNxgres

A four-container back end using Docker Compose, with one container each for an Nginx reverse proxy server, an Express.js application server, a Redis cache and a PostgreSQL database.

The setup serves a simple static front end demonstrating the flow of data from the client through the reverse proxy and application server to the database. The whole is intended as a working template for similar setups and a sandbox for learning and experimentation with more advanced features and interactions.

It is not fully production ready, absent for example a production ready session store. See [Notes on the services](#notes-on-the-services) below for more information.

In certain areas it provides as options one or more additional lines commented out, and includes comments on choices available and those made for this version.

For the whole at a glance, see [the current repository tree](#repository-tree).

- [Getting started](#getting-started)
    - [Pulling the images](#pulling-the-images)
    - [Listing all elements](#listing-all-elements)
    - [Removal in full or part](#removal-in-full-or-part)
- [Unit & integration tests](#unit--integration-tests)
- [Environment & mode](#environment--mode)
    - [Environment variables](#environment-variables)
    - [Development & production](#development--production)
        - [Combined](#combined)
        - [Separate](#separate)
    - [Running the application server alone](#running-the-application-server-alone)
- [Notes on the services](#notes-on-the-services)
    - [app-proxy (Nginx reverse proxy server)](#app-proxy-nginx-reverse-proxy-server)
    - [app-server (Express.js application server)](#app-server-expressjs-application-server)
    - [app-cache (Redis cache)](#app-cache-redis-cache)
    - [app-db (PostgreSQL database)](#app-db-postgresql-database)
- [Development plan](#development-plan)
- [Repository tree](#repository-tree)

## Getting started

You'll need both Docker and Docker Compose installed. Your Docker install may have included Compose. You can check which are present by running the commands `docker -v` and `docker-compose -v` to get the version numbers.

To create and run the containers, clone this repository to a new directory and at the root of that directory run the following:

```shell
docker-compose up
```

To stop the containers, `Ctrl-C` can be used.

To remove the containers, run the following:

```shell
docker-compose down
```

Alternatively, or if this fails, the following command runs a script to remove each container by name:

```shell
docker rm app-server app-cache app-db app-proxy
```

### Pulling the images

In the event that one or more of the four Docker images used is not pulled automatically from Docker Hub, the appropriate `docker pull` command can be used. For the specific images used:

```shell
docker pull node:16.3.0-alpine3.13
docker pull redis:6.2.4-alpine3.13
docker pull postgres:13.3-alpine
docker pull nginx:1.21.0-alpine
```

### Listing all elements

To list the current images, containers and volumes, run the following command:

```shell
docker ps -a && docker images && docker volume ls
```

This is also available as a script, run with the following command:

```shell
npm run compose:ls
```

### Removal in full or part

Assuming that the new directory name is 'docNxgres', and that the Express.js service name in 'docker-compose.yml' is the default `server`, it should be possible to remove the application server image by running the following:

```shell
docker rmi docnxgres_server
```

Assuming 'docNxgres' as above, and that the PostgreSQL service name is the default `db`, it should be possible to remove the data volumes by running the following:

```shell
docker volume rm docnxgres_app-cache-data docnxgres_app-db-data
```

The command `npm run compose:rm:c` runs a script to remove the containers, specifically `docker-compose down` (see above). The commands `npm run compose:rm:ci`, `npm run compose:rm:cv` and `npm run compose:rm:civ` each run a script combining two or three removals, removing either the containers and the image (`:ci`), the containers and the database volume (`:cv`) or the containers, the image and the volume (`:civ`). These scripts are also uses of `docker-compose down`.

If permissions for Docker are not yet set up, it should be possible to precede each of the commands above with `sudo`.

## Unit & integration tests

The tests use the npm packages `mocha`, `chai` and `chai-http` as dev dependencies. They assume that the test database container defined in 'dokcer-compose_test.yml' is running.

The database container can be run with the following command:

```shell
npm run test:up
```

The tests can then be run using:

```shell
npm test
```

This script sets four environment variables to override development values defined in the '.env' file and contains the `mocha --recursive` command. The `--recursive` flag ensures tests in subdirectories are also run.

There is also a 'watch' script to watch for and test on changes:

```shell
npm run watch
```

When complete, the containers can be stopped with `Ctrl-C` and the containers and volumes removed using the command:

```shell
npm run test:down
```

All three scripts are among those defined in the 'package.json' file.

## Environment & mode

### Environment variables

Environment variables are set in five files.

The root directory contains a '.env' file with environment variables. For the database, there are two sets of variables, one for development mode and one for production mode. The majority of the variables contain placeholder values. For use in production, the default production password value should be changed.

Also in the root directory are two Dockerfiles, one for development and one for production. Each sets the environment variable 'NODE_ENV' to the corresponding value.

Finally, the root directory contains four 'docker-compose' files:

1. 'docker-compose.yml', which has settings for the dev and prod variants with the dev variant commented out;
2. 'docker-compose_dev.yml' for the dev variant;
3. 'docker-compose_prod.yml' for the prod variant;
4. 'docker-compose_test.yml' for the test containers.

Each of the first three of these does the following:

- sets the `SERVER_PORT` environment variable;
- uses three of the database variables set in '.env' to initialize the database container, whether for development or production, with the alternate three commented out (see [Development & production](#development--production) below);
- passes the `LOG_FORMAT` environment variable to the reverse proxy server container.

The application server file 'src/config/index.js' accesses the '.env' file using the `dotenv` package. The applicable set of database variables, whether for development or production, is selected using the value of the `NODE_ENV` environment variable. `NODE_ENV` is also used to set an `IN_PROD` environment variable. All relevant variables are then exported for use elsewhere in the application server code.

### Development & production

#### Combined

The file 'docker-compose.yml' specifies whether the application server image is to be built for development or for production.

The default mode is production mode, but this is not to imply that the setup is fully production ready. See [Notes on the services](#notes-on-the-services) below for more information.

For development mode, uncomment line 10 - `dockerfile: Dockerfile_dev` - and comment out line 11 - `dockerfile: Dockerfile_prod`.

For development, it is also possible to uncomment line 17 - `./:/usr/src/server/` - to allow changes in the source code on the host system to be applied within the container. This allows `nodemon` to be restarted by making a file change, which may be required if the application server container is ready before the database.

If different database settings are required for development, these can be set in the corresponding environment variables in the '.env' file. Those variables can then be uncommented in the file 'docker-compose.yml' and the alternate variables for production commented out.

#### Separate

The files 'docker-compose_dev.yml' and 'docker-compose_prod.yml' each contain the settings for the corresponding variant of the file 'docker-compose.yml', avoiding the need to comment out and uncomment lines.

The use of 'prod' for one of the variants is not to imply that the setup is fully production ready. See [Notes on the services](#notes-on-the-services) below for more information.

To run the containers with a variant file, the `-f` flag can be used, as below:

```shell
docker-compose -f docker-compose_dev.yml up
```

A script containing the relevant command is available for each variant file, and both can be found in the file 'package.json'. The script for the dev variant is run with the following command:

```shell
npm run compose:dev
```

To remove the containers, the standard command can be used:

```shell
docker-compose down
```

Again, this is the content of the following script:

```shell
npm run compose:rm:c
```

The commands `npm run compose:rm:ci`, `npm run compose:rm:cv` and `npm run compose:rm:civ` can be used to go further, each running a script combining two or three removals, removing either the containers and the image (`:ci`), the containers and the database volume (`:cv`) or the containers, the image and the volume (`:civ`).

### Running the application server alone

To run the application server outside of the four-container setup, the value of each preferred -`_HOST` environment variable should be changed from the service name `cache` or `db` to an alternative, presumably `localhost`.

Two start scripts are available in the file 'package.json'.

To use `nodemon`, run:

```shell
npm run dev
```

Otherwise, run:

```shell
npm run prod
```

## Notes on the services

### app-proxy (Nginx reverse proxy server)

The 'nginx.conf' and 'default.conf.template' configuration files for the Nginx reverse proxy are mounted into the container. Changes made outside of the container can be applied within by restarting the containers.

- At the top of 'nginx.conf', `user` is set to `nobody`, but an alternative user may be preferred.
- Around midway down 'nginx.conf' and in 'default.conf.template', logging is set to a light level. Specifially, in 'nginx.conf', a custom `discreet` log format is defined, while in 'default.conf.template', the log file 'proxy_access.log' has its format set via the `LOG_FORMAT` environment variable to this `discreet` format. In 'nginx.conf', the line for error logging into 'proxy_error.log' has been commented out as an equivalent discreet format cannot trivially be applied. The intention here is to avoid data collection issues by default, but if greater collection is required, the log format can be modified or one or more new formats added, the error logging line uncommented and moved to 'default.conf.template' and/or a bind mount for 'proxy_error.log' added to each relevant 'docker-compose' file as for the access log.
- In the server block in 'default.conf.template', the reverse proxy is set to listen on port 80. In each 'docker-compose' file, port 80 is mapped to port 8080 to avoid conflict, but this may need to be changed.

Reading up on [the Nginx image](https://hub.docker.com/_/nginx) is recommended.

### app-server (Express.js application server)

As described in [Environment variables](#environment-variables) above, the file 'src/config/index.js' accesses the '.env' file using the `dotenv` package and exports all relevant environment variables for use elsewhere in the application server code.

For development, it is possible to allow changes in the source code on the host system to be applied within the container (see [Development & production](#development--production) above).

- The file 'src/index.js' is the entrypoint for the app, using the `cluster` module to start additional processes based on CPUs and the `SERVER_MULTIPLIER` environment variable.
- The file 'src/app.js' contains several comments explaining choices available and made for this version.
    1. The `csurf` package providing protection against CSRF requires the use of the `cookie-parser` or the `express-session` package. In this case, `cookie-parser` has been chosen, for greater simplicity and in line with the approach to data collection issues taken also with logging (see below).
    However, 'src/app.js' contains lines also for `express-session`, specifically lines requiring the package, importing the `SSN` environment variables for session configuration, for the configuration itself and for the `csurf` middleware. These lines are commented out, available as an alternative, albeit with additional changes needed. Using npm, `express-session` can be installed with the command `npm install express-session` and `cookie-parser` uninstalled with `npm uninstall cookie-parser`.
    The configuration for both middlewares assumes the use of HTTPS in production. If `express-session` were to be used in production, the Nginx reverse proxy server would require directives for `X-Forwarded` headers and an alternative session store would need to be used in place of the non-production MemoryStore. While MemoryStore does allow the application server to run if the `cluster` module is not used, e.g. if `app.listen` is applied in 'app.js' and 'index.js' omitted, a warning is given.
    2. With the default four-container setup, static files are served from the Nginx reverse proxy server. However, 'src/app.js' does contain a line for static serving via Express, by means of the `express.static` middleware. This line is commented out, available as an alternative when the Nginx container is not in use.
    3. The file assumes that data posted from client is sent as a JSON string. However, both 'src/app.js' and 'src/public/script.js' contain lines for use of URI encoding. These lines are commented out, available as an alternative.
- The file 'src/app.js' also requires the `logger` middleware from the 'log' folder, using the `morgan` package. As with the reverse proxy server, logging is set to a light level (see [app-proxy (Nginx reverse proxy server)](#app-proxy-nginx-reverse-proxy-server) above). The intention here is to avoid data collection issues by default, but if greater collection is required, the log format can be modified, one of the `morgan` presets listed in 'src/log/logger.js' used or one or more new formats added. The 'log' folder also contains the file 'utils.js' offering an `addLogEntry` function for use in error logging.

Reading up on [the Node.js image](https://hub.docker.com/_/node) is recommended.

The `npm audit` command can be used to run a security audit on the dependencies used, with the process returning information on updates where available. The command `npm audit fix` can be used instead or thereafter to install compatible updates. See the npm documentation for [more detail](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities).

### app-cache (Redis cache)

- In each 'docker-compose' file, the 'cache' service is assigned a volume named 'app-cache-data' in which data is persisted between uses of the container. If no longer needed, this volume can be removed (see [Getting started](#getting-started) above).

Reading up on [the Redis image](https://hub.docker.com/_/redis) is recommended.

### app-db (PostgreSQL database)

As described in [Environment variables](#environment-variables) above, three of the database variables set in '.env' are used in each 'docker-compose' file to initialize the database container.

There are two sets of variables, one for development mode and one for production mode. The majority of the variables contain placeholder values. For use in production, the default production password value should be changed.

The environment variables `POSTGRES_USER` and `POSTGRES_PASSWORD` are required to set up a superuser for the container, while `POSTGRES_DB` is optional, used to provide a different name for the default database created when the container is run.

- If not already present in the database, an 'entries' table is created in the database by code in the file 'src/db/entries.js' in the application server container.
- In each 'docker-compose' file, the 'db' service is assigned a volume named 'app-db-data' in which data is persisted between uses of the container. If no longer needed, this volume can be removed (see [Getting started](#getting-started) above).

Reading up on [the PostgreSQL image](https://hub.docker.com/_/postgres) is recommended.

## Development plan

The following are possible next steps in the development of the code base. The general medium-term aim is a more fully-featured, production-ready template which remains useful as an aid to learning. Pull requests are welcome for these and any other potential improvements.

- implement a production-grade session store
- extend the demonstration REST API to include further CRUD operations and more complex queries
- provide a parallel GraphQL implementation
- include error logging in the application server log stream
- extend the set of unit & integration tests
- add rate limiting to the reverse proxy server
- add file caching to the reverse proxy server
- migrate the project to TypeScript, retaining optional use of JavaScript only for ease of access

## Repository tree

```
./
├─ logs
│  ├─ proxy_access.log
│  └─ server.log
├─ src
│  ├─ cache
│  │  ├─ client.js
│  │  ├─ index.js
│  │  └─ operations.js
│  ├─ config
│  │  └─ index.js
│  ├─ controllers
│  │  ├─ entries.js
│  │  └─ index.js
│  ├─ db
│  │  ├─ crud.js
│  │  ├─ entries.js
│  │  ├─ index.js
│  │  ├─ pool.js
│  │  └─ table.js
│  ├─ log
│  │  ├─ index.js
│  │  ├─ logger.js
│  │  ├─ logstream.js
│  │  └─ utils.js
│  ├─ public
│  │  ├─ script.js
│  │  └─ style.css
│  ├─ routes
│  │  ├─ entries.js
│  │  ├─ error.js
│  │  └─ index.js
│  ├─ services
│  │  ├─ entries.js
│  │  └─ index.js
│  ├─ utils
│  │  ├─ format.js
│  │  └─ index.js
│  ├─ views
│  │  ├─ includes
│  │  │  ├─ footer.pug
│  │  │  ├─ form.pug
│  │  │  └─ header.pug
│  │  ├─ error.pug
│  │  ├─ index.pug
│  │  └─ layout.pug
│  ├─ app.js
│  └─ index.js
├─ test
│  ├─ db
│  │  ├─ crud.test.js
│  │  ├─ db.test.js
│  │  └─ table.test.js
│  ├─ log
│  │  ├─ log.test.js
│  │  ├─ logger.test.js
│  │  ├─ logstream.test.js
│  │  └─ utils.test.js
│  ├─ utils
│  │  ├─ format.test.js
│  │  └─ utils.test.js
│  └─ app.test.js
├─ .dockerignore
├─ .env
├─ .gitignore
├─ Dockerfile_dev
├─ Dockerfile_prod
├─ LICENSE.txt
├─ README.md
├─ default.conf.template
├─ docker-compose.yml
├─ docker-compose_dev.yml
├─ docker-compose_prod.yml
├─ docker-compose_test.yml
├─ nginx.conf
├─ package.json
└─ package-lock.json
```
