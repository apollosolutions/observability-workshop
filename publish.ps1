Get-Content env:

Get-Content .env | ForEach-Object {
  $name, $value = $_.split('=')
  if ([string]::IsNullOrWhiteSpace($name) || $name.Contains('#')) {
    continue
  }
  Set-Content env:\$name $value
}

rover subgraph publish ${env:APOLLO_GRAPH_REF} --name posts --routing-url http://localhost:4002/ --schema ./subgraphs/posts/schema.graphql --allow-invalid-routing-url
rover subgraph publish ${env:APOLLO_GRAPH_REF} --name users --routing-url http://localhost:4001/ --schema ./subgraphs/users/schema.graphql --allow-invalid-routing-url