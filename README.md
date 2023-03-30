[![DOI](https://zenodo.org/badge/53664497.svg)](https://zenodo.org/badge/latestdoi/53664497)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4276/badge)](https://bestpractices.coreinfrastructure.org/projects/4276)
[![Code 
analysis](https://github.com/MetabolicAtlas/MetabolicAtlas/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/MetabolicAtlas/MetabolicAtlas/actions/workflows/codeql-analysis.yml)

<img src="./frontend/public/apple-touch-icon-152x152.png" width="76px">

## About Metabolic Atlas

Metabolic Atlas is a web platform integrating open-source genome scale metabolic models (GEMs) for easy browsing and analysis. The goal is to collect many curated GEMs, and to bring these models closer to [FAIR principles](https://en.wikipedia.org/wiki/FAIR_data). The website provides visualisations and comparisons of the GEMs, and links to resources, algorithms, other databases, and more general software applications. In short, the vision is to create a one-stop-shop for everything metabolism related. Read more about the project [on the About page](https://metabolicatlas.org/about).

## Cite us

If you use _Metabolic Atlas_ in your scientific work, please cite:

> Version 3.0: Li, F., et al, 2022. _GotEnzymes: an extensive database of enzyme parameter predictions_. NAR, gkac831 [doi:10.1093/nar/gkac831](https://doi.org/10.1093/nar/gkac831)

To cite previous versions or other adjacent work, see the [Citation page on the website](https://metabolicatlas.org/about/platform#citation).

## Contributing

If you would like to contribute to the project, for example if you have ideas for new features, discovered a bug or if you would like to improve the code base, please have a look at [CONTRIBUTING.md](https://github.com/MetabolicAtlas/MetabolicAtlas/blob/main/CONTRIBUTING.md). All ideas and contributions are highly appreciated.

If you discover any potential vulnerabilities associated with the project, please reach out to us at [contact@metabolicatlas.org](mailto:contact@metabolicatlas.org).

## Get started

The front-end uses [Vue.js](https://vuejs.org), with help of [Vue CLI](https://cli.vuejs.org/). The backend uses [ExpressJS](https://expressjs.com/) and [Neo4j](https://neo4j.com/) as the database.

[Docker](https://www.docker.com/products/docker) and docker-compose are used to manage the dependencies of this project. Start by installing these if they are not present on the system.

If you want to try out the latest features of MetabolicAtlas, change the branch to `main`.

Apart from the current repository, two additional repositories are required in
order to deploy Metabolic Atlas locally, they are

- [data-generation](https://github.com/MetabolicAtlas/data-generation): for generating neo4j database
- [data-files](https://github.com/MetabolicAtlas/data-files): contains all the data necessary data (integrated models, maps, FTP repository) using Git LFS

Clone the three required repositories by

    git clone https://github.com/MetabolicAtlas/MetabolicAtlas
    git clone https://github.com/MetabolicAtlas/data-generation
    git clone https://github.com/MetabolicAtlas/data-files && pushd data-files; git lfs pull; popd

Go to the repository `data-generation` and follow the [instructions](https://github.com/MetabolicAtlas/data-generation#readme) on how to generate the data files required by Metabolic Atlas.

In the folder `MetabolicAtlas` that has been cloned, add a `env-local.env` file based on the `env-local.env.sample` file:

```bash
cp env-local.env.sample env-local.env
```

and modify this `env-local.env` file.

Make sure the paths for `DATA_FILES_PATH` and `DATA_GENERATOR_PATH` are correct for your setup, eg. the paths to where you have downloaded the repositories `data-files` and `data-generation`.

To load the list of helper commands run:

```bash
source proj.sh
```

Run the helper command that creates the database and builds the Docker images of the project:

```bash
build-stack
```

Finally, start the Docker containers with

```bash
start-stack
```

Given successful deployment, the frontend should be accessible at: `http://localhost/`. If you encounter any problems try looking at the logs `logs api` / `logs frontend`.

To deploy the stack to a remote server, create another `ENV` file, e.g. `env-dev.env`, and modify it accordingly:

```bash
cp env-local.env.sample env-dev.env
```

Use the tag of the file (`dev` in the previous example) as an argument to the `deploy-stack` command to pass the `ENV` file to the Docker command and the Docker compose file:

```bash
deploy-stack dev
```

### GotEnzymes

To reconstruct the database for GotEnzymes on the local (development) machine. Run the following. This should take ~10 minutes.

```bash
 ma-exec pg psql -f scripts/init.sql -U postgres
```

For remote servers, the init script is configured to run automatically if the database has not been initialized. To reconstruct the database, delete the mounted volume for the database on the remote server (located at `/var/lib/docker-volumes/pg/postgres-data`) and deploy again.

## Description of helper commands

- To bootstrap the project: `build-stack`
- To run the project: `start-stack`
- To stop the project: `stop-stack`
- To run a command inside a docker container: `ma-exec <CONTAINER_NAME> <COMMAND>`. Below is a list of useful container specific commands.

  - Run API data validation tests: `ma-exec api yarn test`
  - Use [prettier](CONTRIBUTING.md#prettier) to format frontend (also works for `api`) files: `ma-exec frontend yarn format`
  - Run [eslint](CONTRIBUTING.md#eslint) for frontend (also works for `api`): `ma-exec frontend yarn lint`
  - Create production build and `stats.html` : `ma-exec frontend yarn build`

- To clean the project (delete containers and volumes): `clean-stack`
- To display real-time logs: `logs [container-name: frontend/api/nginx/neo4j/ftp]`
- To deploy the project: `deploy-stack`
- To (re-)import the Neo4j database: `import-db`

### A note to Unix/Linux users

When rebuilding the stack, you might have to change the ownership of the directory `neo4j`:

```
sudo chown -R <user> neo4j
```

Replace `<user>` with your user name. The ownership will be automatically reset when running the project, so you will have to repeat this step for every rebuild.

## Licenses

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMetabolicAtlas%2FMetabolicAtlas.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMetabolicAtlas%2FMetabolicAtlas?ref=badge_large)
