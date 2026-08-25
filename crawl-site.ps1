$ErrorActionPreference = 'Continue'
$siteRoot = [Uri]'https://snacksgg.neocities.org/'
$outputRoot = (Get-Location).Path
$queue = [Collections.Generic.Queue[Uri]]::new()
$seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$queued = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$refreshHtml = $true

function Add-Url([Uri]$uri) {
    if ($uri.Host -ne $siteRoot.Host) { return }
    if ($uri.Scheme -notin @('http', 'https')) { return }
    $key = $uri.GetLeftPart([UriPartial]::Path)
    if ($queued.Add($key)) { $queue.Enqueue([Uri]$key) }
}

function Get-Target([Uri]$uri) {
    $path = [Uri]::UnescapeDataString($uri.AbsolutePath).TrimStart('/')
    if (-not $path) { return Join-Path $outputRoot 'index.html' }
    $extension = [IO.Path]::GetExtension($path)
    if (-not $extension) { $path = $path.TrimEnd('/') + '/index.html' }
    return Join-Path $outputRoot ($path.Replace('/', [IO.Path]::DirectorySeparatorChar))
}

function Download-Url([Uri]$uri) {
    $target = Get-Target $uri
    $folder = Split-Path -Parent $target
    if (-not (Test-Path -LiteralPath $folder)) { New-Item -ItemType Directory -Path $folder -Force | Out-Null }
    $refreshTarget = $refreshHtml -and $target.ToLowerInvariant().EndsWith('.html')
    if ((Test-Path -LiteralPath $target) -and -not $refreshTarget) { return $target }
    $temporary = "$target.download"
    & curl.exe -L --fail --silent --show-error --retry 1 --retry-delay 1 --connect-timeout 8 --max-time 30 $uri.AbsoluteUri -o $temporary
    if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $temporary)) {
        Move-Item -LiteralPath $temporary -Destination $target -Force
        Write-Host "Saved $($uri.AbsolutePath)"
        return $target
    }
    if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary -Force }
    Write-Warning "Skipped $($uri.AbsoluteUri)"
    return $null
}

function Find-References([Uri]$pageUri, [string]$content, [bool]$isCss) {
    $values = [Collections.Generic.List[string]]::new()
    if ($isCss) {
        foreach ($match in [regex]::Matches($content, '(?i)url\(\s*["'']?([^"'')]+)')) { $values.Add($match.Groups[1].Value) }
        foreach ($match in [regex]::Matches($content, '(?i)@import\s+(?:url\()?\s*["'']([^"'']+)')) { $values.Add($match.Groups[1].Value) }
    } else {
        foreach ($match in [regex]::Matches($content, '(?i)(?:href|src|poster)\s*=\s*["'']([^"'']+)')) { $values.Add($match.Groups[1].Value) }
        foreach ($match in [regex]::Matches($content, '(?i)url\(\s*["'']?([^"'')]+)')) { $values.Add($match.Groups[1].Value) }
        foreach ($match in [regex]::Matches($content, '(?i)["'']((?:/|\./|\.\./)[^"'']+\.(?:png|jpe?g|gif|webp|svg|ico|css|js|woff2?|ttf|mp3|ogg|wav))["'']')) { $values.Add($match.Groups[1].Value) }
    }
    foreach ($valueRaw in $values) {
        $value = [Net.WebUtility]::HtmlDecode($valueRaw.Trim())
        if (-not $value -or $value -match '^(#|data:|javascript:|mailto:|tel:)') { continue }
        try { $resolved = [Uri]::new($pageUri, $value) } catch { continue }
        Add-Url $resolved
    }
}

Add-Url $siteRoot
while ($queue.Count -gt 0) {
    $uri = $queue.Dequeue()
    $key = $uri.GetLeftPart([UriPartial]::Path)
    if (-not $seen.Add($key)) { continue }
    $target = Download-Url $uri
    if (-not $target -or -not (Test-Path -LiteralPath $target)) { continue }
    $extension = [IO.Path]::GetExtension($target).ToLowerInvariant()
    if ($extension -eq '.css') {
        Find-References $uri (Get-Content -LiteralPath $target -Raw) $true
    } elseif ($extension -in @('.html', '.htm') -or $target.EndsWith('index.html')) {
        Find-References $uri (Get-Content -LiteralPath $target -Raw) $false
    }
}

Write-Host "Crawl complete: $($seen.Count) URLs processed."
