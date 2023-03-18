_setup-environment () {
  # Helper function that initializes the needed environment variables.
  "${got_environment:-false}" && return
  got_environment=true
  
  # Ensure that both docker and docker-compose is in $PATH (assumed to
  # be living in /usr/local/bin).
  PATH=$PATH:/usr/local/bin

  # Bail out if docker is not found.
  if ! command -v docker >/dev/null
  then
    echo 'Missing essential Docker components' >&2
    return 1
  fi

  # Use docker with its compose sub-command if it's available, otherwise
  # use docker-compose.
  if docker help compose >/dev/null 2>&1
  then
    compose_cmd=( docker compose )
  else
    compose_cmd=( docker-compose )
  fi

  CHOSEN_ENV=${CHOSEN_ENV:-./env-local.env}

  printf 'Using %s\n' "$CHOSEN_ENV"
  . "$CHOSEN_ENV" || return
}

_docker-compose () (
  set -e

  _setup-environment

  # Use specific compose file for overrides.
  # If 1st arg is "remote", use remote compose file (and remove arg).
  # If 1st arg is "local", use local compose file (and remove arg).
  # If 1st arg is anything else, use local compose file (and keep arg).
  case $1 in
    remote) shift; set -- -f docker-compose-remote.yml "$@" ;;
    local)  shift; set -- -f docker-compose-local.yml  "$@" ;;
    *)
      # No shift, otherwise the same as above
      set -- -f docker-compose-local.yml "$@"
  esac

  DOCKER_BUILDKIT=1 "${compose_cmd[@]}" --env-file "$CHOSEN_ENV" \
    -f docker-compose.yml \
    "$@"
)

install-check () (
  # Performs a number of tests:
  #
  # * Ensures that the data-files and data-generation repositories are
  #   available and optionally up to date (unless invoked with -q).
  # * Ensures that the yarn and node executables are available and
  #   sufficiently up to date.
  # * Ensures that other tools used by these functions are available.

  if [ ! -d ../data-generation/.git ]; then
    echo 'Git repository ../data-generation not found' >&2
    return 1
  fi
  if [ ! -d ../data-files/.git ]; then
    echo 'Git repository ../data-files not found' >&2
    return 1
  fi

  if [ "$1" != -q ]; then
    echo 'Update data-generation and data-file?' >&2
    select yesno in Yes No; do
      case $yesno in
        Yes)
	  git -C ../data-files pull
	  git -C ../data-files lfs pull
	  git -C ../data-generation pull
	  break
	  ;;
        No) break
      esac
    done
  fi  

  for cmd in yarn node docker rsync; do
    if ! command -v "$cmd" >/dev/null; then
      printf 'Essential tool "%s" not found\n' "$cmd" >&2
      return 1
    fi
  done

  set -- yarn 1.22 node v12
  while [ "$#" -gt 0 ]; do
    version=$( "$1" --version )
    if ! printf '%s\n' "$2" "$version" | sort -V -c 2>/dev/null
    then
      printf 'Require at least verison %s of %s, got version %s\n' \
        "$2" "$1" "$version" >&2
      return 1
    fi
    shift 2
  done

  echo 'Everything seems to be in order'
)

generate-data () (
  set -e

  _setup-environment

  install-check -q

  # Call generate-data with the option --reset-db to force overwriting
  # existing data files.  See ../data-generation/index.js
  yarn --cwd "$DATA_GENERATOR_PATH" start "$DATA_FILES_PATH" "$@"

  rsync -a "$DATA_GENERATOR_PATH"/neo4j/ neo4j/import/
  rsync -a "$DATA_GENERATOR_PATH"/dataOverlay api/
  rsync -a "$DATA_GENERATOR_PATH"/gemRepository frontend/public/assets/
  rsync -a "$DATA_FILES_PATH"/integrated-models/integratedModels.json api/src/data/
  rsync -a "$DATA_FILES_PATH"/gemsRepository.json \
           "$DATA_GENERATOR_PATH"/identifiers.js api/src/data/
  rsync -a "$DATA_FILES_PATH"/svg api/
  rsync -a "$DATA_FILES_PATH"/repository ftp/
  rsync -a "$DATA_FILES_PATH"/repository api/
)

build-stack () (
  set -e

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

  # Use a different environment file if given an argument.
  CHOSEN_ENV=./env-${1:-local}.env

  generate-data

  _docker-compose remote \
    --project-name metabolicatlas \
    up --detach --build --force-recreate --remove-orphans --renew-anon-volumes

  echo "ALTER USER postgres WITH PASSWORD :'passwd'" |
  ma-exec -T pg \
    psql --username=postgres \
      --variable=passwd="$POSTGRES_PASSWORD"
)

import-db () (
  set -e

  generate-data --reset-db

  ma-exec neo4j \
    cypher-shell \
      --username "$NEO4J_USERNAME" \
      --password "$NEO4J_PASSWORD" \
      --format plain \
      --file /opt/neo4j-import/import.cypher
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
    install-check \
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

	install-check [-q]
	deactivate
END_INFO
