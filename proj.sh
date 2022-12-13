# To make sure docker-compose is in the path
export PATH=$PATH:/usr/local/bin
LOCALENV="local"
METATLAS_DEFAULT_ENV="env-${LOCALENV}.env"
CHOSEN_ENV=$METATLAS_DEFAULT_ENV

function generate-data {
  # enable flag "-q" to force overwritting existing data files
  echo "Using $CHOSEN_ENV"
  source $CHOSEN_ENV && yarn --cwd $DATA_GENERATOR_PATH start $DATA_FILES_PATH "$@"
  /bin/cp -rf $DATA_GENERATOR_PATH/neo4j/* neo4j/import
  /bin/cp -rf $DATA_GENERATOR_PATH/dataOverlay api/
  /bin/cp -rf $DATA_GENERATOR_PATH/gemRepository/* frontend/public/assets/gemRepository/
  /bin/cp  -f $DATA_FILES_PATH/integrated-models/integratedModels.json api/src/data/
  /bin/cp  -f $DATA_FILES_PATH/gemsRepository.json api/src/data/
  /bin/cp -rf $DATA_FILES_PATH/svg api/
  /bin/cp -rf $DATA_FILES_PATH/repository ftp/
  /bin/cp -rf $DATA_FILES_PATH/repository api/
}

function build-stack {
  generate-data
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml build
}

function build-specific {
  docker-compose --env-file env-local.env -f docker-compose.yml -f docker-compose-local.yml up -d --no-deps --build $@
}

function start-stack {
  # create empty file if it does noot exist to avoid error
  touch frontend/stats.html 

  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml up --detach
  docker cp frontend:/project/yarn.lock frontend/yarn.lock
  docker cp api:/project/yarn.lock api/yarn.lock
}

function stop-stack {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml stop
}

function clean-stack {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml down --rmi all --remove-orphans -v
}

function logs {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml logs -f $@
}

function ma-exec {
  docker compose --env-file "$CHOSEN_ENV"  -f docker-compose.yml -f docker-compose-local.yml exec "$@"
}

function deploy-stack {
# If this function is interrupted (ctrl+c), uset the DOCKER_CONTEXT so that the dev context won't be kept
# We use TERM instead of RETURN, as RETURN does not work on zsh.
# As a potential side effect, the trap might be called also later when interrupting functions from this script.
  trap 'unset DOCKER_CONTEXT; trap - INT' INT TERM
  CHOSEN_ENV="env-${1:-$LOCALENV}.env"
  generate-data
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-remote.yml --project-name metabolicatlas up --detach --build --force-recreate --remove-orphans --renew-anon-volumes
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-remote.yml exec -d pg psql -U postgres -c "alter user postgres with password '${POSTGRES_PASSWORD}';"
  CHOSEN_ENV=$METATLAS_DEFAULT_ENV
  export DOCKER_CONTEXT=default
}

function import-db {
  generate-data --reset-db
  docker exec -it neo4j bash -c "cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} --format plain --file import/import.cypher"
}


echo -e "Available commands:
\tbuild-stack
\tbuild-specific [container(s)]
\tstart-stack
\tstop-stack
\tclean-stack
\tdeploy-stack <CONTEXT>
\timport-db
\tma-exec [container command(s)]
\tlogs [container]"
