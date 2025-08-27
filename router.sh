set -a
source .env
set +a

/Users/bnj/rust/router/target/release/router --config router.yaml --supergraph supergraph.graphql --hr
