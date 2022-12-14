FROM postgres:14.3-alpine as dataloader


COPY scripts/init.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=change-me
ENV PGDATA=/data

COPY enzymes-deploy.zip  /input_data/enzymes.zip
RUN ["rm", "-f", "input_data/enzymes/*", "input_data/supplementary/*"]
RUN ["unzip", "-oq", "input_data/enzymes.zip"]

# Make sure postrgres is not actually started after data import
RUN ["sed", "-i", "s/exec \"$@\"/echo \"skipping...\"/", "/usr/local/bin/docker-entrypoint.sh"]
RUN ["/usr/local/bin/docker-entrypoint.sh", "postgres"]


FROM postgres:14.3-alpine
####
ENV PGDATA=/data
COPY --from=dataloader /data $PGDATA
