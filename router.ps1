Get-Content .env | ForEach-Object {
  $name, $value = $_.split('=')
  if ([string]::IsNullOrWhiteSpace($name) || $name.Contains('#')) {
    continue
  }
  Set-Content env:\$name $value
}

./router.exe --config router.yaml --hr