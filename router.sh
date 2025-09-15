set -a
source .env
set +a

cargo run --manifest-path $HOME/rust/router/Cargo.toml --bin router -- --config router.yaml --supergraph supergraph.graphql --hr
# /Users/bnj/rust/router/target/release/router --config router.yaml --supergraph supergraph.graphql --hr
