# setup-pc.ps1 - Install semua tools untuk edit video (HyperFrames + Claude Code)
# Cara guna: klik kanan fail ni > "Run with PowerShell"
#   atau:   powershell -ExecutionPolicy Bypass -File .\setup-pc.ps1
# Selamat untuk run berulang kali - benda yang dah ada akan di-skip.

param(
    [string]$ProjectRoot = ""
)

# Auto pilih folder projek: guna G:\ kalau ada (PC rumah), kalau takde guna C:\ (PC ofis)
$FolderName = "Recorder Live Host Qherbs Marketing"
if (-not $ProjectRoot) {
    if (Test-Path "G:\$FolderName") { $ProjectRoot = "G:\$FolderName" }
    else { $ProjectRoot = "C:\$FolderName" }
}

$ErrorActionPreference = "Continue"
$log = Join-Path $env:TEMP "setup-pc-log.txt"
Start-Transcript -Path $log -Force | Out-Null

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  [!!]   $msg" -ForegroundColor Yellow }

function Refresh-Path {
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                [Environment]::GetEnvironmentVariable("Path", "User")
}

function Winget-Install($id, $name) {
    winget list -e --id $id --accept-source-agreements *> $null
    if ($LASTEXITCODE -eq 0) { Ok "$name dah ada (skip)"; return }
    Write-Host "  Installing $name ..."
    winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -eq 0) { Ok "$name siap" } else { Warn "$name gagal (exit $LASTEXITCODE)" }
}

function Download($url, $dest) {
    if (Test-Path $dest) { return }
    try { Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing; Ok (Split-Path $dest -Leaf) }
    catch { Warn "Gagal download $url" }
}

# ---------------------------------------------------------------- 1. winget
Step "1/7 Semak winget"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Warn "winget takde. Install 'App Installer' dari Microsoft Store, lepas tu run script ni semula."
    Stop-Transcript | Out-Null
    Read-Host "Tekan Enter untuk tutup"
    exit 1
}
Ok "winget ada"

# ---------------------------------------------------------------- 2. apps
Step "2/7 Install Node.js, FFmpeg, Python, Git"
Winget-Install "OpenJS.NodeJS.LTS"     "Node.js LTS"
Winget-Install "Gyan.FFmpeg"           "FFmpeg (+ffprobe)"
Winget-Install "Python.Python.3.12"    "Python 3.12"
Winget-Install "Git.Git"               "Git"
Refresh-Path

# pilih python
$py = $null
if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3.12 --version *> $null
    if ($LASTEXITCODE -eq 0) { $py = @("py", "-3.12") }
}
if (-not $py -and (Get-Command python -ErrorAction SilentlyContinue)) { $py = @("python") }
if (-not $py) { Warn "Python tak jumpa dalam PATH. Tutup & buka semula PowerShell, run script ni sekali lagi." }

# ---------------------------------------------------------------- 3. GPU
Step "3/7 Semak GPU NVIDIA"
$gpu = $false
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    $g = nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader 2>$null
    if ($g) { $gpu = $true; Ok "GPU: $g" }
}
if (-not $gpu) { Warn "nvidia-smi takde - transcribe akan guna CPU (lambat). Update driver NVIDIA kalau ada GPU." }

# ---------------------------------------------------------------- 4. python packages
Step "4/7 Install Python packages"
if ($py) {
    $pyExe = $py[0]; $pyArgs = @($py | Select-Object -Skip 1)
    & $pyExe @pyArgs -m pip install --upgrade pip
    & $pyExe @pyArgs -m pip install numpy opencv-python onnxruntime auto-editor scenedetect faster-whisper
    if ($gpu) {
        # CUDA 12 libs untuk faster-whisper guna GPU
        & $pyExe @pyArgs -m pip install nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*"
    }
    Ok "Python packages siap"
}

# ---------------------------------------------------------------- 5. hyperframes browser
Step "5/7 HyperFrames + Chrome Headless Shell"
if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx --yes hyperframes@latest browser ensure
    Ok "Chrome headless shell siap"
} else { Warn "npx takde - tutup & buka semula PowerShell, run script ni sekali lagi." }

# ---------------------------------------------------------------- 6. shared assets
Step "6/7 Folder projek + Fonts + GSAP di $ProjectRoot"
# struktur folder ikut arahan.md
foreach ($sub in "raw", "broll", "img", "sfx", "music", "shared\sfx", "shared\music", "Claude outputs") {
    New-Item -ItemType Directory -Force -Path (Join-Path $ProjectRoot $sub) | Out-Null
}
Ok "Folder projek sedia: $ProjectRoot"
$drive = (Get-Item $ProjectRoot).PSDrive
$freeGB = [math]::Round($drive.Free / 1GB, 1)
if ($freeGB -lt 50) { Warn "Disk $($drive.Name): tinggal $freeGB GB. Video live 3 jam + render perlu ~50GB+." }
else { Ok "Disk $($drive.Name): $freeGB GB kosong" }
if (Test-Path $ProjectRoot) {
    $fonts = Join-Path $ProjectRoot "shared\fonts"
    $js    = Join-Path $ProjectRoot "shared\js"
    New-Item -ItemType Directory -Force -Path $fonts, $js | Out-Null
    $cdn = "https://cdn.jsdelivr.net/npm/@fontsource"
    $list = @(
        "anton/files/anton-latin-400-normal.woff2",
        "poppins/files/poppins-latin-600-normal.woff2",
        "poppins/files/poppins-latin-700-normal.woff2",
        "poppins/files/poppins-latin-800-normal.woff2",
        "poppins/files/poppins-latin-900-normal.woff2",
        "playfair-display/files/playfair-display-latin-700-italic.woff2",
        "playfair-display/files/playfair-display-latin-800-italic.woff2",
        "dm-serif-display/files/dm-serif-display-latin-400-italic.woff2"
    )
    foreach ($f in $list) { Download "$cdn/$f" (Join-Path $fonts (Split-Path $f -Leaf)) }
    Download "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js" (Join-Path $js "gsap.min.js")
} else {
    Warn "Folder $ProjectRoot takde (mungkin PC lain). Skip fonts. Run: .\setup-pc.ps1 -ProjectRoot 'D:\folder\kau'"
}

# power: jangan sleep bila plug in (render panjang)
powercfg /change standby-timeout-ac 0
Ok "Sleep bila plug in = Never"

# ---------------------------------------------------------------- 7. report
Step "7/7 Laporan"
Write-Host "`n-- Whisper yang ada dalam PC ni --"
if ($py) {
    foreach ($p in "openai-whisper", "faster-whisper", "whisperx") {
        & $pyExe @pyArgs -m pip show $p *> $null
        if ($LASTEXITCODE -eq 0) { Ok "$p (Python)" }
    }
}
foreach ($c in "whisper", "whisper-cli", "whisper-cpp", "main") {
    $cmd = Get-Command $c -ErrorAction SilentlyContinue
    if ($cmd) { Ok "$c -> $($cmd.Source)" }
}

Write-Host "`n-- hyperframes doctor --"
if (Get-Command npx -ErrorAction SilentlyContinue) { npx --yes hyperframes@latest doctor }

Stop-Transcript | Out-Null
Write-Host "`nSIAP. Log penuh: $log" -ForegroundColor Green
Write-Host "Copy semua output dari '7/7 Laporan' ke bawah, paste kat Claude." -ForegroundColor Green
Read-Host "Tekan Enter untuk tutup"
