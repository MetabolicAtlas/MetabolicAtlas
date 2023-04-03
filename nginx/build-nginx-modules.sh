# Taken from https://raw.githubusercontent.com/nginxinc/docker-nginx/master/modules/Dockerfile.alpine
set -ex

apk update
apk add linux-headers openssl-dev pcre2-dev zlib-dev openssl abuild \
    musl-dev libxslt libxml2-utils make mercurial gcc unzip git \
    xz g++ coreutils

printf "#!/bin/sh\\nSETFATTR=true /usr/bin/abuild -F \"\$@\"\\n" > /usr/local/bin/abuild
chmod +x /usr/local/bin/abuild
hg clone -r ${NGINX_VERSION}-${PKG_RELEASE} https://hg.nginx.org/pkg-oss/
cd pkg-oss && mkdir /tmp/packages

ENABLED_MODULES="$@"

for module in $ENABLED_MODULES; do
    echo "Building $module for nginx-$NGINX_VERSION";
    if [ -d /modules/$module ]; then
        echo "Building $module from user-supplied sources";

        if [ ! -s /modules/$module/source ]; then
            echo "No source file for $module in modules/$module/source, exiting";
            exit 1; \
        fi;

        if [ -f /modules/$module/build-deps ]; then
            echo "Installing $module build dependencies";
            apk update && apk add $(cat /modules/$module/build-deps | xargs);
        fi; \

        if [ -x /modules/$module/prebuild ]; then
            echo "Running prebuild script for $module";
            /modules/$module/prebuild;
        fi;

        /pkg-oss/build_module.sh -v $NGINX_VERSION -f -y -o /tmp/packages -n $module $(cat /modules/$module/source);
        BUILT_MODULES="$BUILT_MODULES $(echo $module | tr '[A-Z]' '[a-z]' | tr -d '[/_\-\.\t ]')";

    elif make -C /pkg-oss/alpine list | grep -E "^$module\s+\d+" > /dev/null; then
        echo "Building $module from pkg-oss sources";
        cd /pkg-oss/alpine;
        make abuild-module-$module BASE_VERSION=$NGINX_VERSION NGINX_VERSION=$NGINX_VERSION;
        apk add $(. ./abuild-module-$module/APKBUILD; echo $makedepends;);
        make module-$module BASE_VERSION=$NGINX_VERSION NGINX_VERSION=$NGINX_VERSION;
        find ~/packages -type f -name "*.apk" -exec mv -v {} /tmp/packages/ \;;
        BUILT_MODULES="$BUILT_MODULES $module";
    else
        echo "Don't know how to build $module module, exiting";
        exit 1;
    fi;
done

echo "BUILT_MODULES=\"$BUILT_MODULES\"" > /tmp/packages/modules.env
