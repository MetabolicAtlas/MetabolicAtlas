# Metabolic Atlas
Welcome to the codebase for the Metabolic Atlas project.

The front-end uses [Vue.js](https://vuejs.org), with help of [webpack](https://webpack.js.org) and [yarn](https://yarnpkg.com/en/). The back-end uses [Django REST framework](http://www.django-rest-framework.org) with [PostgreSQL](https://www.postgresql.org) as the database.  
To learn more about the project, please visit the [wiki](https://github.com/SysBioChalmers/MetabolicAtlas/wiki).

## Prerequisites
Docker, along with docker-compose, is used to manage the dependencies of this project. To install docker, download it from [here](https://www.docker.com/products/docker) (docker-compose should be installed along with the process).

## Get started

Add a `postgres.env` file based on the `postgres.env.sample` file:
```bash
cp postgres.env.sample postgres.env
```
and modify the `postgres.env`.

To get a list of helper commands:
```bash
source proj.sh
```

Build and run the project:
```bash
build-stack
start-stack
```

The frontend should be available at: `http://localhost/` and the backend should be available at: `http://localhost/api/` via Swagger. If you encounter any problems try running `restart-stack`, or look at the logs `logs backend` / `logs frontend`

### Create the databases

#### GEMs database

Connect to the corresponding DB docker container (db):
```bash
docker exec -it db  bash
```

To disconnect all sessions open on a database use:
```bash
SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'gems' AND pid <> pg_backend_pid();
```

Create the db in psql (-U postgres):
```sql
CREATE DATABASE "gems" WITH OWNER 'postgres' ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;
```

To import models from metabolicAtlas.org (old website) and biomet-toolbox:

Extract model_files_full.tar.gz (available in the MetabolicAtlas folder on Box) into backend/model_files/ (might not exist) and run in the **backend container**:

```bash
python manage.py makemigrations
python manage.py migrate --database gems
python manage.py getMAModels
```

Follow the instructions displayed at the end to serve the models file from ftp.metabolicatlas.org.
Note: model files are stored in backend/model_files/FTP, removing this folder will re-download models files from remote locations (http://www.metabolicatlas.org/ and http://biomet-toolbox.chalmers.se/).


To import **public** models from SysbioChalmers Github organization, run:
```bash
python manage.py getGithubModels
```
Watch out the API rate limit (https://developer.github.com/v3/rate_limit/).

#### Integrated model databases

Connect to the db container and once inside run psql

```bash
psql -U postgres
```

Create databases using psql (in the docker container), example for human1:

```bash
CREATE DATABASE "human1" WITH OWNER 'postgres' ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;
```

To disconnect all sessions open on a database use:
```bash
SELECT pid, pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'human1' AND pid <> pg_backend_pid();
```

Then connect to the **backend container** and run:
```bash
source postgres.env                               # to load the environment variables

python manage.py makemigrations
python manage.py migrate --database [database] e.g. 'human1' (see settings.py)
python manage.py populateDB [database] [YAML file]
python manage.py addAnnotations [database] 'all' # add content of annotations files found in annotation/human1/ in the database
# this command populates annotations data in tables: metabolite, enzyme, reaction and subsystem

```

(as adapted from `http://eli.thegreenplace.net/2014/02/15/programmatically-populating-a-django-database`)

Insert information related to the svg maps, such as:
- the association between model compartments <=> compartment SVG maps
- the association between model subsystems <=> subsystem SVG maps
- the localization (in which maps to find) metabolite ID / reaction ID / enzymes ID on maps

```bash
python manage.py addMapsInformation [database] [map type] [map directory] [map metadata file]
# with [map type] 'compartment' or 'subsystem', [map directory] the folder where to with the svg files
# and [map metadata file] a TSV file that describes svg file and link each file to a compartment/subsystem of the model
```
see the example file [human1_compartmentSVG.tsv](/backend/database_generation/example/human1_compartmentSVG.tsv)

#### Using the dump files

Alternativly one can create and import the database content using the .db files stored on the box folder:
``` bash
docker exec -i db psql -U postgres < human1.db
docker exec -i db psql -U postgres < yeast8.db
docker exec -i db psql -U postgres < gems.db
```

Then do not forget to resync the migrations files with:
```bash
docker exec backend python manage.py makemigrations
docker exec backend python manage.py migrate --database yeast8 --fake
docker exec backend python manage.py migrate --database human1 --fake
docker exec backend python manage.py migrate --database gems --fake
```

### Dump databases

Integrated model databases:
```bash
docker exec -it db  pg_dump -U postgres -d human1 --create -T 'auth_*' -T 'django_*' > human1.db
```
Once imported the database cannot be migrated anymore with django, thus should only be used for production. To create a working version of the db, remove "--create -T 'auth_*' -T 'django_*'"

GEMs database:
```bash
docker exec -it db pg_dump -U postgres -d gems --create -T 'auth_*' -T 'django_*' > gems.db
```

### Import databases

```bash
docker exec -it db psql -U postgres human1 < PATH_TO_DB_FILE
docker exec -it db psql -U postgres gems < PATH_TO_DB_FILE
```

### Adding a new model in the website (under development)

1) The model must be publicly available online, and must have a valid README file to parse with:

```bash
python manage.py getGithubModels
```
Make sure the YAML format of the model is available.

Each model is stored in separated database.

2) Create the database as described in [Integrated model databases](#Integrated_model_databases) section.

3) Add the database in the `settings.py` file with the name used to create the database, e.g.

```bash
...
'human1': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': 'human1',
    'USER': os.getenv('POSTGRES_USER'),
    'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
    'HOST': 'db',
    'PORT': 5432,
},
...
```

4) run makemigrations and migrate the new database as described in [Full model databases](#Integrated_model_databases) section.

5) run populateDB. The 'model label' is extracted/generate when reading the model README file step 1) and is written in the 'gem' table.
  - if you got an error when parsing the YAML file, run python fixYAML.py [model yml file] located in backend/database_generation

6) add the model in the function componentDBserializerSelector() (views.py) and create custom serializers (serializers.py and serializers_rc.py) if needed

7) add Data about the model in the frontend page: (TO BE SIMPLIFIED)
  - add the model in the dictionnary 'starredComponent' of GEMBrowser.vue
  - add the model in the dictionnaries 'mainTableKey' and 'externalIDTableKey' of Metabolite.vue, Enzyme.vue, Reaction.vue
  - add the model in the dictionnary 'tableStructure' of CloseInteractionPartners.vue
  - add the model in the dictionnaries 'compartmentOrder', (optional)'systemOrder', and 'selectedElementDataKeys' of MapViewer.vue


### All helper commands

```bash
source proj.sh
```

Then you will get access to the following commands:
* To bootstrap the project: `build-stack`
* To run the project: `start-stack`
* To display real-time logs: `logs`
* To stop the project: `stop-stack`
* To create new migration files: `db-make-migrations`
* To run a database migration: `db-migrate`
