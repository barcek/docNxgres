# docNxgres

A three-container back end using docker-compose, with one container each for an Nginx reverse proxy, an Express.js server and a PostgreSQL database.

The setup serves a simple static front end demonstrating the flow of data from the client through the reverse proxy and application server to the database.

The whole is intended as a working template for similar setups and a sandbox for experimentation with more advanced features and interactions. In certain areas it provides as options one or more additional lines commented out, and includes comments on choices available and those made for this version.

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

The root directory contains a '.env' file with environment variables. For the database, there are two sets of variables, one for development and one for production. The majority of the variables contain placeholder values. For use in production, the default production password value should be changed.

Also in the root directory are two Dockerfiles, one for development and one for production. Each sets the environment variable 'NODE_ENV' to the corresponding value.

Finally, the root directory contains the file 'docker-compose.yml', which does the following:

- sets the `SERVER_PORT` environment variable;
- uses three of the database variables set in '.env' to initialize the database container, whether for development or production, with the alternate three commented out (see [Development & production](#development--production) below).

The file 'src/config/index.js' accesses the '.env' file using the `dotenv` package. The applicable set of database variables, whether for development or production, is selected using the value of the 'NODE_ENV' environment variable. `NODE_ENV` is also used to set an `IN_PROD` environment variable. All relevant variables are then exported for use elsewhere in the application server code.

### Development & production

The file 'docker-compose.yml' specifies whether the application server image is to be built for development or for production.

The default is production.

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

The 'nginx.conf' configuration file for the Nginx reverse proxy is mounted into the container. Changes made outside of the container can be applied within by restarting the containers.

- At the top of 'nginx.conf', `user` is set to `nobody`, but an alternative user may be preferred.
- Around midway down 'nginx.conf', logging is set to a light level. The file 'proxy_access.log' uses a custom `brief_format`. The line for error logging into 'proxy_error.log' is commented out as an equivalent brief format cannot trivially be applied. The intention here is to avoid data collection issues by default, but if greater collection is required, the log format can be extended or reverted, the error logging line uncommented and a bind mount for 'proxy_error.log' added to 'docker-compose.yml' as for the access log.
- In the server block in 'nginx.conf', the reverse proxy is set to listen on port 80. In the file 'docker-compose.yml', port 80 is mapped to port 8080 to avoid conflict, but this may need to be changed.

### app-server (Express.js application server)

To follow.

### app-db (PostgreSQL database)

To follow.
