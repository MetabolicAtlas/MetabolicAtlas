#!/bin/sh

set -e

# Set the password
neo4j-admin set-initial-password "$NEO4J_PASSWORD"

if [ ! -e "/var/lib/neo4j/logs/neo4j.log" ] ; then
  touch /var/lib/neo4j/logs/neo4j.log
fi

# Start server
neo4j start

# Wait for server to start
until grep -qF 'Started.' /var/lib/neo4j/logs/neo4j.log
do
  echo Waiting for neo4j to start
  sleep 1
done

# Import data
cypher-shell \
  --username "$NEO4J_USERNAME" \
  --password "$NEO4J_PASSWORD" \
  --format plain \
  --file import/import.cypher

# Stop server
neo4j stop
