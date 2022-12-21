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

function upload-gotenzymes-input-data {
  if [ "$DOCKER_CONTEXT" != "" -a "$DOCKER_CONTEXT" != "default" ]; then
    remote_host_with_user=`docker context inspect $DOCKER_CONTEXT | grep Host | awk -F\/ '{print $NF}' | awk -F\" '{print $1}'`
    echo "Upload GotEnzymes input data to server '${remote_host_with_user/*@/}'"
    if [ "$remote_host_with_user" != "" ]; then
      rsync -auzqO --chmod=ugo=rwX pg/input_data/ $remote_host_with_user:/var/lib/docker-volumes/pg/input_data/
    fi
  fi
}

function build-stack {
  generate-data
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml build
}

function build-specific {
  docker compose --env-file env-local.env -f docker-compose.yml -f docker-compose-local.yml up -d --no-deps --build $@
}

function start-stack {
  # create empty file if it does noot exist to avoid error
  touch frontend/stats.html
  mkdir -p pg/postgres-data

  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml up --detach
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-local.yml exec -d pg psql -U postgres -c "alter user postgres with password '${POSTGRES_PASSWORD}';"
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
  if [ "$1" == "" ];then
      echo "CONTEXT is missing!"
      echo "Usage: deploy-stack <CONTEXT>"
      return
  fi
  CHOSEN_ENV="env-${1:-$LOCALENV}.env"
  generate-data
  upload-gotenzymes-input-data
  remote_host_with_user=`docker context inspect $DOCKER_CONTEXT | grep Host | awk -F\/ '{print $NF}' | awk -F\" '{print $1}'`
  ssh $remote_host_with_user docker system prune --all --force
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-remote.yml --project-name metabolicatlas up --detach --build --force-recreate --remove-orphans --renew-anon-volumes
  docker compose --env-file $CHOSEN_ENV -f docker-compose.yml -f docker-compose-remote.yml exec -d pg psql -U postgres -c "alter user postgres with password '${POSTGRES_PASSWORD}';"
  CHOSEN_ENV=$METATLAS_DEFAULT_ENV
  export DOCKER_CONTEXT=default
}

function update-gotenzymes {
  trap 'unset DOCKER_CONTEXT; trap - INT' INT TERM
  CHOSEN_ENV="env-${1:-$LOCALENV}.env"
  eval `grep DOCKER_CONTEXT $CHOSEN_ENV`
  if [ "$DOCKER_CONTEXT" == "default" ];then
      composefile=docker-compose-local.yml
  else
      composefile=docker-compose-remote.yml
      upload-gotenzymes-input-data
  fi
  echo "Update GotEnzymes database for docker context '$DOCKER_CONTEXT'"
  docker compose --env-file "$CHOSEN_ENV"  -f docker-compose.yml -f $composefile exec pg psql -f /docker-entrypoint-initdb.d/init.sql -U postgres
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
\tupdate-gotenzymes [CONTEXT]
\tma-exec [container command(s)]
\tlogs [container]"
