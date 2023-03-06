# Dream-Builder

Run docker-containers
```
docker-compose up
```

## Requirements
1. Store `.env` file.

Example of `.env`:
```
URL__FRONTEND=http://frontend:5372
URL__AUTH_API=http://auth-api:9998
URL__DISTRIBUTIONS_API=http://distributions-api:9999

DB__USER=user
DB__PASSWORD=password
DB__HOST=hpst
DB__PORT=5432
DB__NAME=name

AUTH__GOOGLE_CLIENT_ID=google_client_id
AUTH__TEST_TOKEN=test_token
AUTH__GOOGLE_CLIENT_SECRET=client_secret
AUTH__REFRESH_TOKEN_LIFETIME_DAYS=42
AUTH__REDIRECT_URI=http://dreambuild.com/redirect_uri
```
2. Store `client_secret.json` in the root directory

Example of `client_secret.json`
```json
{
  "web": {
    "client_id": "client_id",
    "project_id": "dream-builder",
    "auth_uri": "auth_uri",
    "token_uri": "token_uri",
    "auth_provider_x509_cert_url": "cert_uri",
    "client_secret": "client_secret",
    "redirect_uris": [
      "http://localhost"
    ],
    "javascript_origins": [
      "http://localhost"
    ]
  }
}

```
