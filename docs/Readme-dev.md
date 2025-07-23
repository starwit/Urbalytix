# Development Documentation
This document describes how setup a local development environment and how to start developing features. If you just want to use the software refer to [manual](Readme-manual.md) for more information.

## How to Build

__Prerequisites__ 

* Java JDK 21 or later
* Maven 3
* PostgreSQL (available for development via docker-compose scripts)
* Keycloak for authentication (optional)
* `vision-api` maven repository setup (see https://github.com/starwit/vision-api?tab=readme-ov-file#java--maven for guidance)

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


### How to build Helm Chart only
The Helm Chart is templated as part of the Maven build process to make version setting easier. Therefore, the files in `deployment/helm` do not form a valid Helm Chart.\
To generate the Helm Chart only you can run: `mvn validate -pl application`\
The generated chart can then be found in `application/target/helm`

## Debugging

You can start the spring boot application in debug mode. See Spring Boot documentation for further details. The easiest way is, to use debug functionality integrated with your IDE like VS Code.

## Postgres Client

The database is available under localhost:5434. A database GUI (pgadmin) is available at localhost:5050 (if you started one of the docker compose environments in `./deployment`).

```properties
Username:Urbalytix
Database:Urbalytix
Password:Urbalytix
```
