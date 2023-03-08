_setup-environment () {
  # Helper function that initializes the needed environment variables.
  "${got_environment:-false}" && return
  got_environment=true
  
  # Ensure that both docker and docker-compose is in $PATH (assumed to
  # be living in /usr/local/bin), and that /bin is first.
  PATH=/bin:$PATH:/usr/local/bin

  # Bail out if docker or docker-compose are not found.
  if ! { command -v docker && command -v docker-compose; } >/dev/null
  then
    echo 'Missing essential Docker components' >&2
    return 1
  fi

  LOCALENV=local
  CHOSEN_ENV=./env-$LOCALENV.env

  printf 'Using %s\n' "$CHOSEN_ENV"
  . "$CHOSEN_ENV" || return
}

_docker-compose () (
  set -e

  # Helper function to reduce clutter and repetition.
  _setup-environment

  DOCKER_BUILDKIT=1 docker-compose --env-file "$CHOSEN_ENV" \
    -f docker-compose.yml \
    -f docker-compose-local.yml \
    "$@"
)

generate-data () (
  set -e

  _setup-environment

  # Call generate-data with the option --reset-db to force overwriting
  # existing data files.  See ../data-generation/index.js
  yarn --cwd "$DATA_GENERATOR_PATH" start "$DATA_FILES_PATH" "$@"

  command cp -rf "$DATA_GENERATOR_PATH"/neo4j/* neo4j/import
  command cp -rf "$DATA_GENERATOR_PATH"/dataOverlay api/
  command cp -rf "$DATA_GENERATOR_PATH"/gemRepository/* frontend/public/assets/gemRepository/
  command cp  -f "$DATA_FILES_PATH"/integrated-models/integratedModels.json api/src/data/
  command cp  -f "$DATA_FILES_PATH"/gemsRepository.json api/src/data/
  command cp -rf "$DATA_FILES_PATH"/svg api/
  command cp -rf "$DATA_FILES_PATH"/repository ftp/
  command cp -rf "$DATA_FILES_PATH"/repository api/
)

build-stack () (
  set -e

  _setup-environment

  generate-data
  _docker-compose build
)

build-specific () (
  _docker-compose up --detach --no-deps --build "$@"
)

start-stack () (
  set -e

  # Create empty file if it doesn't exist, to avoid error.
  touch frontend/stats.html 

  _docker-compose up --detach

  docker cp frontend:/project/yarn.lock frontend/yarn.lock
  docker cp api:/project/yarn.lock api/yarn.lock
)

stop-stack () (
  _docker-compose stop
)

clean-stack () (
  _docker-compose down --rmi all --remove-orphans --volumes
)

logs () (
  _docker-compose logs --follow "$@"
)

ma-exec () (
  _docker-compose exec "$@"
)

deploy-stack () (
  set -e

  _setup-environment

  CHOSEN_ENV=./env-${1:-$LOCALENV}.env

  generate-data

  _docker-compose \
    --project-name metabolicatlas \
    up --detach --build --force-recreate --remove-orphans --renew-anon-volumes

  echo "ALTER USER postgres WITH PASSWORD :'passwd'" |
  ma-exec -T pg \
    psql --username=postgres \
      --variable=passwd="$POSTGRES_PASSWORD"
)

import-db () (
  set -e

  _setup-environment

  generate-data --reset-db

  ma-exec neo4j \
    cypher-shell \
      --username "$NEO4J_USERNAME" \
      --password "$NEO4J_PASSWORD" \
      --format plain \
      --file import/import.cypher
)

deactivate () {
  # Uninstalls the installed shell functions.

  set -- \
    _docker-compose \
    _setup-environment \
    build-specific \
    build-stack \
    clean-stack \
    deactivate \
    deploy-stack \
    generate-data \
    import-db \
    logs \
    ma-exec \
    start-stack \
    stop-stack

  unset -f "$@"
}

cat <<'END_INFO'
Available commands: 
	build-stack
	build-specific [container(s)]
	start-stack
	stop-stack
	clean-stack
	deploy-stack <CONTEXT>
	import-db
	ma-exec [container command(s)]
	logs [container]
	deactivate
END_INFO
