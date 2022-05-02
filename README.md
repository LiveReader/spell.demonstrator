# SPELL Demonstrator

Build a docker-compose file using the following template:

```yaml
version: "3.4"

services:
    app:
        container_name: spell-demonstrator
        build:
            context: .
            dockerfile: ./Dockerfile
        ports:
            - "3000:80"
        restart: unless-stopped
```
