# Taken from https://raw.githubusercontent.com/nginxinc/docker-nginx/master/modules/Dockerfile.alpine
set -ex

source /tmp/packages/modules.env
for module in $BUILT_MODULES; do
    apk add --no-cache --allow-untrusted /tmp/packages/nginx-module-${module}-${NGINX_VERSION}*.apk;
done
rm -rf /tmp/packages
