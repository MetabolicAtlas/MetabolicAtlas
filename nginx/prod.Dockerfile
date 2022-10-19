FROM node:16-alpine AS frontend
ARG VUE_APP_MATOMOID
ENV VUE_APP_MATOMOID $VUE_APP_MATOMOID
ARG VUE_APP_HOTJAR
ENV VUE_APP_HOTJAR $VUE_APP_HOTJAR
WORKDIR /project
COPY frontend .
RUN yarn && yarn build

FROM jonasal/nginx-certbot:3.2.0-nginx1.23.1-alpine
COPY nginx/redirector.conf /etc/nginx/conf.d/redirector.conf
COPY nginx/prod.nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=frontend /project/dist /content
