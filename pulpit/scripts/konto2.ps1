# Zakłada drugie konto Claude Code obok pierwszego, ze wspólną historią rozmów, skillami i ustawieniami.
# Uruchom w PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\konto2.ps1
# Nic nie kasuje. Jeśli folder już istnieje, tylko dokłada brakujące połączenia.
$ErrorActionPreference = "Stop"
$k1 = Join-Path $env:USERPROFILE ".claude"
$k2 = Join-Path $env:USERPROFILE ".claude-konto2"
New-Item -ItemType Directory -Force -Path $k2 | Out-Null

# Wspólne foldery (połączenia katalogów, bez kopiowania): historia, skille, agenci, polecenia
foreach ($name in @("projects", "skills", "agents", "commands")) {
  $src = Join-Path $k1 $name
  $dst = Join-Path $k2 $name
  if (-not (Test-Path $src)) { New-Item -ItemType Directory -Force -Path $src | Out-Null }
  if (Test-Path $dst) { Write-Host "Jest już: $dst (zostawiam)"; continue }
  cmd /c mklink /J "$dst" "$src" | Out-Null
  Write-Host "Połączono $dst -> $src"
}

# Wspólny CLAUDE.md użytkownika i ustawienia (kopia, żeby każde konto mogło mieć swoją linię statusu)
foreach ($file in @("CLAUDE.md", "settings.json")) {
  $src = Join-Path $k1 $file
  $dst = Join-Path $k2 $file
  if ((Test-Path $src) -and -not (Test-Path $dst)) { Copy-Item $src $dst; Write-Host "Skopiowano $file" }
}

Write-Host ""
Write-Host "Gotowe. Teraz zaloguj drugie konto:"
Write-Host "  `$env:CLAUDE_CONFIG_DIR = `"$k2`"; claude"
Write-Host "i w Claude wpisz /login. Albo w Pulpicie: Claude, Konto 2, Zaloguj."
