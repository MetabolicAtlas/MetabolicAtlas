FROM node:14-alpine AS frontend
WORKDIR /project
COPY frontend .
RUN yarn && yarn build

FROM staticfloat/nginx-certbot
COPY nginx/prod.nginx.conf /etc/nginx/user.conf.d/nginx.conf
COPY --from=frontend /project/dist /content
