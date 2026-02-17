set -a
source .env
set +a

./router --config router.yaml --supergraph supergraph.graphql --hr
