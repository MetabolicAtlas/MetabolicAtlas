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

function start-stack {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml up --detach
  docker cp frontend:/project/yarn.lock frontend/yarn.lock
  docker cp api:/project/yarn.lock api/yarn.lock
}

function stop-stack {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml kill
}

function clean-stack {
  docker stop $(docker ps -a -q) || true
  docker rm $(docker ps -a -q) || true
  docker volume prune --force || true
}

function logs {
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml logs -f $@
}

function ma-exec {
  docker compose -f docker-compose.yml -f docker-compose-local.yml exec $@
}

function deploy-stack {
  CHOSEN_ENV="env-${1:-$LOCALENV}.env"
  generate-data
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-remote.yml --project-name metabolicatlas up --detach --build --force-recreate --remove-orphans --renew-anon-volumes
  CHOSEN_ENV=$METATLAS_DEFAULT_ENV
}

function import-db {
  generate-data --reset-db
  docker exec -it neo4j bash -c "cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} --format plain --file import/import.cypher"
}

echo -e "Available commands:
\tbuild-stack
\tstart-stack
\tstop-stack
\tclean-stack
\tdeploy-stack <CONTEXT>
\timport-db
\tma-exec [container command(s)]
\tlogs [container]"
