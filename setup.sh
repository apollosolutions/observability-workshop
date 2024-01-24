#!/bin/bash
set -e
curl -sSL https://router.apollo.dev/download/nix/v1.37.0 | sh # install router
npm install # dependencies for subgraphs/datasource
docker compose pull
docker pull grafana/k6:0.46.0
echo "Please enter the graphref and key into a '.env' file using the '.env.sample' file provided."
echo "Once finished, please run publish.sh to publish the schemas and run 'npm run dev' to get started."
