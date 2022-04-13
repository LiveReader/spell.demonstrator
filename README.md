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
            args:
                NPM_TOKEN: <YOUR PERSONAL ACCESSTOKEN>
        ports:
            - "3000:80"
        restart: unless-stopped
```

You'll need to set the `NPM_TOKEN` argument to allow access to certain npm packages hostes on the GitHub Package Registry. It requires your personal access token that has the necessary permissions to access packages. More details in the [Notitia Docs](https://docs.livereader.online/#github-package-registry).
