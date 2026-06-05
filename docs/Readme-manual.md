# Urbalytics Manual
Here you can find information on how to deploy and run Urbalytix.

## Installation

### Deployment Architecture
Following image shows the target environment in which Urbalytix is supposed to run.

![](Architecture-Urbalytix.svg)

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
  context_path: "/urbalytix"

  # configuration for an endpoint from which app will collect GeoJSON features
  feature_collection:
    enabled: true
    endpoint: https://hostname:port
    secret: supersecret

  spring_data: # Configuration to connect to Redis/ValKey
    redis_active: false # only if true connection config is used
    redis_host: localhost
    redis_port: 6379
    aggregator_stream_prefix: aggregator # if aggregation messages are published under a different name
    positionsource_stream_prefix: positionsource # if position messages are published under a different name
    detection_stream_prefix: objectdetector # if detection messages are published under a different name
    detection_scale: 20 # scale factor of vehicle route density

  # mapping external roles to standard internal ones
  security:
    rolemapping:
      admin: urbalytix_admin
      user: urbalytix_user
      reader: urbalytix_reader

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