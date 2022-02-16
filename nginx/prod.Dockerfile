FROM node:16-alpine AS frontend
ARG VUE_APP_MATOMOID
ENV VUE_APP_MATOMOID $VUE_APP_MATOMOID
ARG VUE_APP_HOTJAR
ENV VUE_APP_HOTJAR $VUE_APP_HOTJAR
WORKDIR /project
COPY frontend .
RUN yarn && yarn build

FROM staticfloat/nginx-certbot
COPY nginx/prod.nginx.conf /etc/nginx/user.conf.d/nginx.conf
COPY --from=frontend /project/dist /content
