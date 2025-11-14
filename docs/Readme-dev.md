# Development Documentation
This document describes how setup a local development environment and how to start developing features. If you just want to use the software refer to [manual](Readme-manual.md) for more information.

## How to Build

__Prerequisites__ 

* Java JDK 21 or later
* Maven 3
* PostgreSQL (available for development via docker-compose scripts)
* Keycloak for authentication (optional)
* `vision-api` maven repository setup (see https://github.com/starwit/vision-api?tab=readme-ov-file#java--maven for guidance)

See section [neccessary infra](#run-necessary-infra) for how to run necessary components with Docker Compose.

In order to run a local development environment execute the following steps.
__Please note__: all steps need to be executed from base folder of repositories.

1) go to the deployment folder and start the environment (database and keycloak) via docker-compose:

    ```bash
    cd deployment
    docker compose up
    ```

2) go to `webclient/app` and install the frontend applications dependencies

    ```bash
    cd webclient/app
    npm install
    ```

3) build the project

    ```bash
    mvn clean install -P frontend
    ```

4) start project

    ```bash
    java -jar application/target/application-0.0.1-SNAPSHOT.jar
    ```

Once all steps ran successfully application will be reachable with the following coordinates:

* application can be reached under <http://localhost:8081/urbalytix/>
* swagger under <http://localhost:8081/urbalytix/swagger-ui/>
* If you are using keycloak:
  * default user/password is admin/admin
  * keycloak can be reached under <http://localost:8081/auth>

### Run necessary infra
Application needs various infrastructure to run e.g. PostgreSQL database. Folder [deployment](../deployment/) contains a number of Docker Compose scripts to run these. 

#### Dump from Timescale running in Kubernetes
If you need data for testing, you can create a dump and copy it to your machine:

1. Access kubernetes cluster and establish a port forward for timescaledb with address 0.0.0.0 and port 5433
2. Run docker compose with `deployment/noauth-docker-compose.yml`
3. Access database container: `docker exec -it urbalytix-db-urbalytix-1 bash`
4. Dump database: `pg_dump -h local-ip-address -p 5433 -U urbalytix -Fc urbalytix > urbalytix.dump`
5. Copy to local database: `pg_restore -h localhost -p 5432 -U urbalytix -d urbalytix urbalytix.dump`
6. Check result with pgAdmin

Default password for dev databases is urbalytix.
Docker compose script run a pre-configured PGAdmin instance here: http://localhost:5050/

## How to build Helm Chart
The Helm Chart is templated as part of the Maven build process to make version setting easier. Therefore, the files in `deployment/helm` do not form a valid Helm Chart.\
To generate the Helm Chart only you can run: `mvn validate -pl application`\
The generated chart can then be found in `application/target/helm`
