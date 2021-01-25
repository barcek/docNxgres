# docNxgres

A three-container back end using docker-compose, with one container each for an Nginx reverse proxy, an Express.js server and a PostgreSQL database.

The setup serves a simple static front end demonstrating the flow of data from the client through the reverse proxy and application server to the database.

The whole is intended as a working template for similar setups and a sandbox for experimentation with more advanced features and interactions.

## Getting started

You'll need Docker installed.

The specific Docker images used can be pulled from Docker Hub with the following command:

```shell
docker pull node:15.4.0-alpine3.10 && docker pull postgres:13.1-alpine && docker pull nginx:1.19.6-alpine
```

The file 'docker-compose.yml' specifies whether the application server image is to be built for development or for production. The default is production. For development uncomment line 10 - `dockerfile: Dockerfile_dev` - and comment out line 11 - `dockerfile: Dockerfile_prod`.

For development, it is recommended that line 15 - `./:/usr/src/server/` - also be uncommented, to allow changes in the source code on the host system to be applied within the container. This also allows `nodemon` to be restarted by making a file change, which may be required if the application server container is ready before the database.

To create and run the containers, clone this repository to a new directory and at the root of that directory run the following:

```shell
docker-compose up
```

To stop the containers, `Ctrl-C` can be used.

To remove the containers, run the following:

```shell
docker-compose down
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
