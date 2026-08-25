$ErrorActionPreference = 'Stop'
$base = [Uri]'https://snacksgg.neocities.org/'
$root = (Get-Location).Path

function Save-Asset([string]$urlText) {
    if ([string]::IsNullOrWhiteSpace($urlText)) { return }
    $clean = [System.Net.WebUtility]::HtmlDecode($urlText.Trim('"', "'"))
    if ($clean -match '^(data:|javascript:|#|mailto:)') { return }
    $uri = [Uri]::new($base, $clean)
    if ($uri.Host -ne $base.Host) { return }
    $path = $uri.AbsolutePath.TrimStart('/')
    if (-not $path -or $path.EndsWith('/')) { return }
    $destination = Join-Path $root ($path -replace '/', [IO.Path]::DirectorySeparatorChar)
    $folder = Split-Path -Parent $destination
    if (-not (Test-Path -LiteralPath $folder)) { New-Item -ItemType Directory -Path $folder -Force | Out-Null }
    if (-not (Test-Path -LiteralPath $destination)) {
        & curl.exe -L --fail --silent --show-error --connect-timeout 8 --max-time 20 $uri.AbsoluteUri -o $destination
        if ($LASTEXITCODE -ne 0) { Write-Warning "Skipped $($uri.AbsoluteUri)" }
    }
}

$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
$matches = [regex]::Matches($html, '(?i)(?:src|href)\s*=\s*["'']([^"''#?]+)')
foreach ($match in $matches) {
    $value = $match.Groups[1].Value
    if ($value -match '\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|mp3|ogg|wav)$') { Save-Asset $value }
}

Save-Asset '/main.css'
$cssFiles = Get-ChildItem -Path $root -Filter '*.css' -Recurse
foreach ($cssFile in $cssFiles) {
    $css = Get-Content -LiteralPath $cssFile.FullName -Raw
    $cssMatches = [regex]::Matches($css, '(?i)url\(\s*["'']?([^"'')?#]+)')
    foreach ($match in $cssMatches) {
        $value = $match.Groups[1].Value
        if ($value.StartsWith('/')) { Save-Asset $value }
        elseif (-not $value.StartsWith('http')) {
            $relative = $cssFile.DirectoryName.Substring($root.Length).TrimStart('\').Replace('\', '/')
            Save-Asset ('/' + (($relative.TrimEnd('/') + '/' + $value).TrimStart('./')))
        }
    }
}

Write-Host 'Mirror complete.'
