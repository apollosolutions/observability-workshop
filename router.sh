set -a
source .env
set +a


if [ -n "$ROUTER_MANIFEST_FILE" ]; then
    cargo run --manifest-path $ROUTER_MANIFEST_FILE --bin router -- --config router.yaml --supergraph supergraph.graphql --hr
else
    ./router -- --config router.yaml --supergraph supergraph.graphql --hr
fi
