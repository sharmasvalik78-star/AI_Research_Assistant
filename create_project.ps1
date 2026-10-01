Write-Host "Creating AI Research Assistant Pro..."

$folders = @(
"backend",
"backend/api",
"backend/core",
"backend/database",
"backend/models",
"backend/services",
"backend/uploads",
"frontend",
"frontend/src",
"frontend/src/components",
"frontend/src/pages",
"frontend/public",
"docs",
"docker",
"scripts"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Write-Host "Created: $folder"
}

Write-Host ""
Write-Host "Project structure created successfully!"