Example for customValues.yaml

```yaml
# Define an ingress to application
ingress:
  enabled: true
  annotations: 
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: aic.starwit-infra.de # hostname
      paths:
        - path: /urbalytix # this is the path your app will be running under
          pathType: ImplementationSpecific
  tls: # if set, TLS will be activated
    - secretName: aic.starwit-infra.de
      hosts:
        - aic.starwit-infra.de

# Configuration to protect application by Keycloak login
auth:
  enabled: false
  keycloakRealmUrlInternal: http://internal-hostname/realms/urbalytix
  keycloakRealmUrlExternal: https://external-hostname/realms/urbalytix
  clientId: urbalytix
  clientSecret: urbalytix 

# database coordinates
database:
  hostname: hostname
  port: 5432
  database: urbalytix
  username: urbalytix
  password: your-secure-password
```