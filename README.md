# docNxgres

A three-container back end using Docker Compose, with one container each for an Nginx reverse proxy server, an Express.js application server and a PostgreSQL database.

The setup serves a simple static front end demonstrating the flow of data from the client through the reverse proxy and application server to the database.

The whole is intended as a working template for similar setups and a sandbox for learning and experimentation with more advanced features and interactions.

It is not fully production ready, in the absence of a production ready session store for example. See [Notes on the services](#notes-on-the-services) below for more information.

In certain areas it provides as options one or more additional lines commented out, and includes comments on choices available and those made for this version.

- [Getting started](#getting-started)
- [Environment & mode](#environment--mode)
    - [Environment variables](#environment-variables)
    - [Development & production](#development--production)
    - [Running the application server alone](#running-the-application-server-alone)
- [Notes on the services](#notes-on-the-services)
    - [app-proxy (Nginx reverse proxy server)](#app-proxy-nginx-reverse-proxy-server)
    - [app-server (Express.js application server)](#app-server-expressjs-application-server)
    - [app-db (PostgreSQL database)](#app-db-postgresql-database)

## Getting started

You'll need Docker installed.

To create and run the containers, clone this repository to a new directory and at the root of that directory run the following:

```shell
docker-compose up
```

To stop the containers, `Ctrl-C` can be used.

To remove the containers, run the following:

```shell
docker-compose down
```

In the event that one or more of the three Docker images used is not pulled automatically from Docker Hub, the appropriate `docker pull` command can be used. For the specific images used:

```shell
docker pull node:15.4.0-alpine3.10
docker pull postgres:13.1-alpine
docker pull nginx:1.19.6-alpine
```

To list the current images, containers and volumes, run the following command:

```shell
docker ps -a && docker images && docker volume ls
```

Assuming that the new directory name is 'docNxgres', and that the Express.js service name in 'docker-compose.yml' is the default `server`, it should be possible to remove the application server image by running the following:

```shell
docker rmi docnxgres_server
```

Assuming 'docNxgres' as above, and that the PostgreSQL service name is the default `db`, it should be possible to remove the data volume by running the following:

```shell
docker volume rm docnxgres_app-db-data
```

If permissions for Docker are not set up, each of the `docker` commands above can be preceded by `sudo`.

## Environment & mode

### Environment variables

Environment variables are set in five files.

The root directory contains a '.env' file with environment variables. For the database, there are two sets of variables, one for development mode and one for production mode. The majority of the variables contain placeholder values. For use in production, the default production password value should be changed.

Also in the root directory are two Dockerfiles, one for development and one for production. Each sets the environment variable 'NODE_ENV' to the corresponding value.

Finally, the root directory contains the file 'docker-compose.yml', which does the following:

- sets the `SERVER_PORT` environment variable;
- uses three of the database variables set in '.env' to initialize the database container, whether for development or production, with the alternate three commented out (see [Development & production](#development--production) below);
- passes the `LOG_FORMAT` environment variable to the reverse proxy server container.

The file 'src/config/index.js' accesses the '.env' file using the `dotenv` package. The applicable set of database variables, whether for development or production, is selected using the value of the `NODE_ENV` environment variable. `NODE_ENV` is also used to set an `IN_PROD` environment variable. All relevant variables are then exported for use elsewhere in the application server code.

### Development & production

The file 'docker-compose.yml' specifies whether the application server image is to be built for development or for production.

The default mode is production mode, but this is not to imply that the setup is fully production ready. See [Notes on the services](#notes-on-the-services) below for more information.

For development mode, uncomment line 10 - `dockerfile: Dockerfile_dev` - and comment out line 11 - `dockerfile: Dockerfile_prod`.

For development, it is also possible to uncomment line 17 - `./:/usr/src/server/` - to allow changes in the source code on the host system to be applied within the container. This allows `nodemon` to be restarted by making a file change, which may be required if the application server container is ready before the database.

If different database settings are required for development, these can be set in the corresponding environment variables in the '.env' file. Those variables can then be uncommented in the file 'docker-compose.yml' and the alternate variables for production commented out.

### Running the application server alone

To run the application server outside of the three-container setup, the value of the preferred -`_HOST` environment variable should be changed from the service name `db` to an alternative, presumably `localhost`.

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
- Around midway down 'nginx.conf' and in 'default.conf.template', logging is set to a light level. Specifially, in 'nginx.conf', a custom `discreet` log format is defined, while in 'default.conf.template', the log file 'proxy_access.log' has its format set via the `LOG_FORMAT` environment variable to this `discreet` format. In 'nginx.conf', the line for error logging into 'proxy_error.log' has been commented out as an equivalent discreet format cannot trivially be applied. The intention here is to avoid data collection issues by default, but if greater collection is required, the log format can be modified or one or more new formats added, the error logging line uncommented and moved to 'default.conf.template' and/or a bind mount for 'proxy_error.log' added to 'docker-compose.yml' as for the access log.
- In the server block in 'default.conf.template', the reverse proxy is set to listen on port 80. In the file 'docker-compose.yml', port 80 is mapped to port 8080 to avoid conflict, but this may need to be changed.

Reading up on [the Nginx image](https://hub.docker.com/_/nginx) is recommended.

### app-server (Express.js application server)

As described in [Environment variables](#environment-variables) above, the file 'src/config/index.js' accesses the '.env' file using the `dotenv` package and exports all relevant environment variables for use elsewhere in the application server code.

For development, it is possible to allow changes in the source code on the host system to be applied within the container (see [Development & production](#development--production) above).

- The file 'src/index.js' is the entrypoint for the app, using the `cluster` module to start additional processes based on CPUs and the `SERVER_MULTIPLIER` environment variable.
- The file 'src/app.js' contains several comments explaining choices available and made for this version.
    1. The `csurf` package providing protection against CSRF requires the use of the `cookie-parser` or the `express-session` package. Here `cookie-parser` package has been chosen, for greater simplicity and in line with the approach to data collection issues taken also with logging (see below). However, 'src/app.js' contains lines also for `express-session`, specifically lines requiring the package, importing the `SSN` environment variables for session configuration, for the configuration itself and for the `csurf` middleware. These lines are commented out, available as an alternative, albeit with additional changes needed. The configuration for both middlewares assumes the use of HTTPS in production. If `express-session` were to be used in production, the Nginx reverse proxy server would require directives for `X-Forwarded` headers and an alternative session store would need to be used in place of the non-production MemoryStore. While MemoryStore does allow the application server to run if the `cluster` module is not used, e.g. if `app.listen` is applied in 'app.js' and 'index.js' omitted, a warning is given.
    2. With the default three-container setup, static files are served from the Nginx reverse proxy server. However, 'src/app.js' does contain a line for static serving via Express, by means of the `express.static` middleware. This line is commented out, available as an alternative when the Nginx container is not in use.
    3. The file assumes that data posted from client is sent as a JSON string. However, both 'src/app.js' and 'src/public/script.js' contain lines for use of URI encoding. These lines are commented out, available as an alternative.
- The file 'src/app.js' also requires the `logger` middleware from the 'log' folder, using the `morgan` package. As with the reverse proxy server, logging is set to a light level (see [app-proxy (Nginx reverse proxy server)](#app-proxy-nginx-reverse-proxy-server) above). The intention here is to avoid data collection issues by default, but if greater collection is required, the log format can be modified, one of the `morgan` presets listed in 'src/log/index.js' used or one or more new formats added. The 'log' folder also contains the `addLogEntry` function for use in error logging.

Reading up on [the Node.js image](https://hub.docker.com/_/node) is recommended.

### app-db (PostgreSQL database)

As described in [Environment variables](#environment-variables) above, three of the database variables set in '.env' are used in 'docker-compose.yml' to initialize the database container.

There are two sets of variables, one for development mode and one for production mode. The majority of the variables contain placeholder values. For use in production, the default production password value should be changed.

The environment variables `POSTGRES_USER` and `POSTGRES_PASSWORD` are required to set up a superuser for the container, while `POSTGRES_DB` is optional, used to provide a different name for the default database created when the container is run.

- If not already present in the database, an 'entries' table is created in the database by code in the file 'src/db/entries.js' in the application server container.
- In the file 'docker-compose.yml', the 'db' service is assigned a volume named 'app-db-data' in which data is persisted between uses of the container. If no longer needed, this volume can be removed (see [Getting started](#getting-started) above).

Reading up on [the PostgreSQL image](https://hub.docker.com/_/postgres) is recommended.

## Development plan

The following are possible next steps in the development of the code base. The general medium-term aim is a more fully-featured, production-ready template which remains useful as an aid to learning. Pull requests are welcome for these and any other potential improvements.

- implement a production-grade session store
- extend the demonstration REST API to include further CRUD operations and more complex queries
- provide a parallel GraphQL implementation
- integrate a data structure cache such as Redis for database results
- include error logging in the application server log stream
- include unit tests
- add rate limiting to the reverse proxy server
- add file caching to the reverse proxy server
- migrate the project to TypeScript, retaining optional use of JavaScript only for ease of access
