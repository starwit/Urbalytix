# Urbalytics Manual

## Installation

### Deployment to Kubernetes using Helm

Helm is the preferred tool to install Urbalytix. Assuming you have a Kubernetes cluster configured, installation can then be done with the following command:

```bash
helm -n urbalytix install urbalytix oci://registry-1.docker.io/starwitorg/urbalytix-chart -f yourvalues.yaml
```

Please note, that namespace is optional and you can define your own release name. For how to use Helm refer to their [docs](https://helm.sh/docs/intro/using_helm/).

Helm chart depends on a running PostgreSQL/Timescale. 

The following custom values.yaml will make application available under hostname _urbalytix.cluster.local_ with no context-path.

```yaml
app:
  context_path: ""

database:
  hostname: hostname
  port: 5432
  database: urbalytix
  username: urbalytix
  password: password

ingress:
  enabled: true
  hosts:
    - host: urbalytix.cluster.local
      paths:
        - path: /
          pathType: ImplementationSpecific
```

More details on the values you need to provide in order run Helm chart on your environment can be found [here](../deployment/helm/urbalytix/Readme.md).

Once you have installed Urbalytix you can reach it's API documentation at http://domain/Urbalytix/swagger-ui/index.html.


## Usage

TODO