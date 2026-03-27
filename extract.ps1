$content = Get-Content '.\buscoabogado_v17 (1).html' -Raw -Encoding UTF8
$styleMatch = [regex]::Match($content, '(?s)<style>(.*?)</style>')
if($styleMatch.Success) {
    $css = $styleMatch.Groups[1].Value.Trim()
    [System.IO.File]::WriteAllText(".\style.css", $css, [System.Text.Encoding]::UTF8)
    Write-Host "CSS extracted: $($css.Length) chars"
} else {
    Write-Host "No style tag found"
}

$scriptMatch = [regex]::Match($content, '(?s)<script>(.*?)</script>')
if($scriptMatch.Success) {
    $js = $scriptMatch.Groups[1].Value.Trim()
    [System.IO.File]::WriteAllText(".\script.js", $js, [System.Text.Encoding]::UTF8)
    Write-Host "JS extracted: $($js.Length) chars"
} else {
    Write-Host "No script tag found"
}

# Create index.html: replace <style>...</style> with link, replace <script>...</script> with src
$html = $content
$html = [regex]::Replace($html, '(?s)<style>.*?</style>', '<link rel="stylesheet" href="style.css">')
$html = [regex]::Replace($html, '(?s)<script>.*?</script>', '<script src="script.js"></script>')
[System.IO.File]::WriteAllText(".\index.html", $html, [System.Text.Encoding]::UTF8)
Write-Host "index.html created"
