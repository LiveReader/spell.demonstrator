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

## Docker-Compose Setup

The [openstreetmap-tile-server](https://github.com/Overv/openstreetmap-tile-server) requires a setup step with an internet connection:

"Note that the import process requires an internet connection. The run process does not require an internet connection. If you want to run the openstreetmap-tile server on a computer that is isolated, you must first import on an internet connected computer, export the osm-data volume as a tarfile, and then restore the data volume on the target computer system."

1. Download and import the required map file: https://download.geofabrik.de/europe/germany-latest.osm.pbf

2. Extract RLP:

```shell
docker run -it -w /wkd -v "$(pwd):/wkd" mschilde/osmium-tool osmium extract --bbox=5.306,46.826,9.316,52.912 -o rhineland-palantine.osm.pbf germany-latest.osm.pbf
```

3. Import the *.osm.pbf file once into the server:

```shell
docker run -e THREADS=16 -e "OSM2PGSQL_EXTRA_ARGS=-C 4096" -v  "$(pwd)/rhineland-palantine.osm.pbf:/data/region.osm.pbf" -v "$(pwd)/osm-data:/data/database/" overv/openstreetmap-tile-server import
```

4. Start the containers:

```shell
    docker-compose up -d
```