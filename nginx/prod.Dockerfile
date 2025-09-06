FROM node:22-alpine AS frontend
ARG VITE_VUE_APP_MATOMOID
ENV VITE_VUE_APP_MATOMOID $VITE_VUE_APP_MATOMOID
ARG VITE_VUE_APP_HOTJAR
ENV VITE_VUE_APP_HOTJAR $VITE_VUE_APP_HOTJAR
WORKDIR /project
COPY frontend .
RUN yarn && yarn build

FROM jonasal/nginx-certbot:6.0.1-nginx1.29.1
COPY nginx/redirector.conf /etc/nginx/conf.d/redirector.conf
COPY nginx/prod.nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=frontend /project/dist /content
