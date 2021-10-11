[![DOI](https://zenodo.org/badge/53664497.svg)](https://zenodo.org/badge/latestdoi/53664497)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4276/badge)](https://bestpractices.coreinfrastructure.org/projects/4276)

Welcome to the codebase for the Metabolic Atlas project.  
If you use *Metabolic Atlas* in your scientific work, please cite:
> Wang, H., et al, 2021. _Genome-scale metabolic network reconstruction of model animals as a platform for translational research_. PNAS 118 [doi:10.1073/pnas.2102344118](https://doi.org/10.1073/pnas.2102344118)
>
> Robinson, J., et al, 2020. _An atlas of human metabolism_. Science Signaling 13 [doi:10.1126/scisignal.aaz1482 ](https://doi.org/10.1126/scisignal.aaz1482)


## Get started
The front-end uses [Vue.js](https://vuejs.org), with help of [Vue CLI](https://cli.vuejs.org/). The backend uses [ExpressJS](https://expressjs.com/) and [Neo4j](https://neo4j.com/) as the database.  

[Docker](https://www.docker.com/products/docker) and docker-compose are used to manage the dependencies of this project. Start by installing these if they are not present on the system.

If you want to try out the latest features of MetabolicAtlas, change the branch to `develop`.

Apart from the current repository, two additional repositories are required in
order to deploy Metabolic Atlas locally, they are

* [data-generation](https://github.com/MetabolicAtlas/data-generation): for generating neo4j database
* [data-files](https://github.com/MetabolicAtlas/data-files): contains all the data necessary data (integrated models, maps, FTP repository) using Git LFS

Clone the three required repositories by 

    git clone https://github.com/MetabolicAtlas/MetabolicAtlas
    git clone https://github.com/MetabolicAtlas/data-generation
    git clone https://github.com/MetabolicAtlas/data-files && pushd data-files; git lfs pull; popd


Go to the repository `data-generation` and follow the
[instructions](https://github.com/MetabolicAtlas/data-generation#readme) on how to generate the data files required by MetabolicAtlas.

In the folder `MetabolicAtlas` that has been cloned, add a `.env` file based on the `.env.sample` file:
```bash
cp .env.sample .env
```
and modify this `.env` file.

The content of the file `.env` that has just been copied from `.env.sample` is
shown below. Make sure the paths for `DATA_FILES_PATH` and
`DATA_GENERATOR_PATH` are correct for your setup, eg. the paths to where you have
downloaded the repositories `data-files` and `data-genertion`.


```
CERTBOT_EMAIL=
SERVER_NAME=localhost
DATA_FILES_PATH=../data-files
DATA_GENERATOR_PATH=../data-generation

NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password-unhackable

FTP_MIN_PORT=30000
FTP_MAX_PORT=31000

PORT_NGINX=80
PORT_FRONTEND=81
PORT_NEO4J_1=7474
PORT_NEO4J_2=7687

IP_FILTER=""
```

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

## Description of helper commands

* To bootstrap the project: `build-stack`
* To run the project: `start-stack`
* To stop the project: `stop-stack`
* To clean the project (delete containers and volumes): `clean-stack`
* To display real-time logs: `logs [container-name: frontend/api/nginx/neo4j/ftp]`
* To deploy the project: `deploy-stack`
* To (re-)import the Neo4j database: `import-db`

### A note to Unix/Linux users

When rebuilding the stack, you might have to change the ownership of the directory `node4j`:
```
sudo chown -R <user> neo4j
```
Replace `<user>` with your user name.
The ownership will be automatically be reset when running the project, so you will
have to repeat this step for every rebuild.


## Licenses

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMetabolicAtlas%2FMetabolicAtlas.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMetabolicAtlas%2FMetabolicAtlas?ref=badge_large)
