FROM node:16-alpine AS frontend
ARG VITE_VUE_APP_MATOMOID
ENV VITE_VUE_APP_MATOMOID $VITE_VUE_APP_MATOMOID
ARG VITE_VUE_APP_HOTJAR
ENV VITE_VUE_APP_HOTJAR $VITE_VUE_APP_HOTJAR
WORKDIR /project
COPY frontend .
RUN yarn && yarn build

FROM jonasal/nginx-certbot:3.2.0-nginx1.23.1-alpine
COPY nginx/install-nginx-modules.sh nginx/build-nginx-modules.sh ./
RUN chmod +x build-nginx-modules.sh install-nginx-modules.sh
RUN ./build-nginx-modules.sh "brotli"
RUN ./install-nginx-modules.sh
COPY nginx/redirector.conf /etc/nginx/conf.d/redirector.conf
COPY nginx/prod.nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=frontend /project/dist /content
