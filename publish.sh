#!/bin/bash
set -a            
source .env
set +a
rover subgraph publish ${APOLLO_GRAPH_REF} --name posts --routing-url http://localhost:4002/ --schema ./subgraphs/posts/schema.graphql --allow-invalid-routing-url
rover subgraph publish ${APOLLO_GRAPH_REF} --name users --routing-url http://localhost:4001/ --schema ./subgraphs/users/schema.graphql --allow-invalid-routing-url