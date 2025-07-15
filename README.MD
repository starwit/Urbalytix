# Urbalytix

This repository contains a software module written in Java, that can run analytical jobs, to condense raw tracking data from Starwit's Awareness Engine (SAE) into usable knowledge. Software is targeted to be run in a Kubernetes cluster. Thus this repo produces a [Docker image](https://hub.docker.com/repository/docker/starwitorg/Urbalytix/general) and Urbalytix can be deployed using Helm.

## License & Usage

Project is licensed under AGPL 3 and the license can be found [here](LICENSE). This component is part of a publicly funded project by the city of Wolfsburg and thus usage in your community is very much encouraged. It is part of a group of software modules that shall help communities to analyze urban space and to gain statistical insights. 

More details on political and organizational background can be found here: https://www.wolfsburg.de/en-us/leben/smart-city

### Contribution

We are grateful for any contribution. Please refer to our [contribution guideline](CONTRIBUTING.md) and instructions document for any information.

## How to Deploy/Install

Helm is the preferred tool to install Urbalytix. Installation can be done with the following command:

```bash
helm -n yournamespace install Urbalytix oci://registry-1.docker.io/starwitorg/Urbalytix -f yourvalues.yaml
```

Please note, that namespace is optional and you can define your own release name. For how to use Helm refer to their [docs](https://helm.sh/docs/intro/using_helm/).

More details on the values you need to provide in order run Helm chart on your environment can be found [here](deployment/helm/Urbalytix/Readme.md).

Once you have installed Urbalytix you can reach it's API documentation at http://domain/Urbalytix/swagger-ui/index.html.

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
