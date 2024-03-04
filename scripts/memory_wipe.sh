POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--token)
      TOKEN="$2"
      shift
      shift
      ;;
    -c|--container-name)
      CONTAINER="$2"
      shift
      shift
      ;;
    -e|--env-name)
      ENV_NAME="$2"
      shift
      shift
      ;;
    -u|--username)
      USER_NAME="$2"
      shift
      shift
      ;;
    -db|--database)
      DB="$2"
      shift
      shift
      ;;
    --ip)
      IP="$2"
      shift
      shift
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1")
      shift
      ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}"

CONTAINER_ID="${echo "docker ps --format '{{.ID}}' | grep '${ENV_NAME}_postgres'"}"

declare -a deployment_list =("${echo "docker exec -it '${CONTAINER_ID}' sh -c psql -U ${USER_NAME} -d ${DATABASE_NAME} -t -c 'select deployment_id from dialog_session where is_active=f'"}")

for i in deployment_list
  do
    curl -X "https://${IP}/api/deployments/${i}"
  done
EOF
