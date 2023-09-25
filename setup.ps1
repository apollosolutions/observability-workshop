# Basic deps
npm install # dependencies for subgraphs/datasource
docker compose pull
docker pull grafana/k6:0.46.0

# Download and extract the Router
Invoke-WebRequest -URI "https://github.com/apollographql/router/releases/download/v1.30.1/router-v1.30.1-x86_64-pc-windows-msvc.tar.gz" -OutFile ".\router.tar.gz"
tar -zxvf router.tar.gz --strip-components=1 "dist/router.exe" 
Remove-Item router.tar.gz

Write-Host "Please enter the graphref and key into a '.env' file using the '.env.sample' file provided."
Write-Host "Once finished, please run publish.sh to publish the schemas and run 'npm run dev' to get started."