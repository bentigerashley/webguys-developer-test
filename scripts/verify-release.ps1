$ErrorActionPreference = "Stop"

function Invoke-Gate([string]$Name, [scriptblock]$Command) {
    Write-Host "==> $Name"
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "$Name failed with exit code $LASTEXITCODE" }
}

$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"

Push-Location $Frontend
try {
    Invoke-Gate "Locked dependency install" { npm ci }
    Invoke-Gate "Frontend lint" { npm run lint }
    Invoke-Gate "Frontend typecheck" { npm run typecheck }
    Invoke-Gate "Frontend tests" { npm test -- --run }
    Invoke-Gate "Frontend production build" { npm run build }
    if (-not (Test-Path ".next/standalone")) { throw "Standalone build output was not created" }
} finally {
    Pop-Location
}

if (Get-Command php -ErrorAction SilentlyContinue) {
    Invoke-Gate "WordPress plugin tests (local PHP)" { php (Join-Path $Root "spaceflight-news-cache/tests/run.php") }
} elseif (Get-Command docker -ErrorAction SilentlyContinue) {
    Invoke-Gate "Docker availability" { docker info --format '{{.ServerVersion}}' }
    Invoke-Gate "WordPress plugin tests (Docker PHP 8.2)" { docker run --rm -v "${Root}:/app" -w /app php:8.2-cli php spaceflight-news-cache/tests/run.php }
} else {
    throw "PHP was not found and Docker is unavailable. Install PHP 8.2+ or start Docker Desktop."
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Invoke-Gate "Deployment shell tests (Docker)" { docker run --rm -v "${Root}:/repo:ro" -w /repo ubuntu:24.04@sha256:4fbb8e6a8395de5a7550b33509421a2bafbc0aab6c06ba2cef9ebffbc7092d90 bash scripts/tests/deployment-scripts.test.sh }
} elseif (Get-Command bash -ErrorAction SilentlyContinue) {
    Invoke-Gate "Deployment shell tests" { bash (Join-Path $Root "scripts/tests/deployment-scripts.test.sh") }
} else {
    throw "Bash was not found and Docker is unavailable. Install Git Bash or start Docker Desktop."
}

Write-Host "Release verification passed."
