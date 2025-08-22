#!/bin/bash

set -e

mongosh -u admin -p adminpwd <<EOF
use journeyhub
db.createUser({
  user: "$MONGO_USER",
  pwd: "$MONGO_PASSWORD",
  roles: [{ role: "readWrite", db: "$MONGODB_INITDB_DATABASE" }]
})
use test
db.createUser({
  user: "$MONGO_USER",
  pwd: "$MONGO_PASSWORD",
  roles: [{ role: "readWrite", db: "test" }]
})
EOF