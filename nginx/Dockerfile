FROM nginx:mainline-alpine as builder

COPY build-nginx-modules.sh .
RUN chmod +x build-nginx-modules.sh
RUN ./build-nginx-modules.sh "brotli"

FROM nginx:mainline-alpine
COPY --from=builder /tmp/packages /tmp/packages
COPY install-nginx-modules.sh .
RUN chmod +x install-nginx-modules.sh
RUN ./install-nginx-modules.sh

COPY nginx.conf /etc/nginx/nginx.conf
