# Pakuje same pliki .md z PROJEKTY GRAFICZNE (kilka MB zamiast 60 GB), np. żeby pokazać je Claude w chmurze.
# Pomija foldery objęte NDA i rozmowy. Uruchom: powershell -ExecutionPolicy Bypass -File scripts\spakuj-md.ps1
$root = Join-Path $env:USERPROFILE "Desktop\PROJEKTY GRAFICZNE"
$out = Join-Path $env:USERPROFILE "Desktop\pulpit_md"
$skip = '\\(RUE_DE_SKIN|smiecie|_SYSTEM\\ROZMOWY|node_modules)\\'
if (Test-Path $out) { Rename-Item $out ("pulpit_md_" + (Get-Date -Format "yyyyMMdd_HHmmss")) }
Get-ChildItem -Path $root -Recurse -Filter *.md -File | Where-Object { $_.FullName -notmatch $skip } | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  $dst = Join-Path $out $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
  Copy-Item $_.FullName $dst
}
Compress-Archive -Path "$out\*" -DestinationPath "$out.zip" -Force
Write-Host "Gotowe: $out.zip"
