Get-Content .env | ForEach-Object {
  $name, $value = $_.split('=')
  if ([string]::IsNullOrWhiteSpace($name)) {
    return
  }

  if( $name.Contains('#')){
    return
  }
  Set-Content env:\$name $value
}
./router.exe --config router.yaml --hr