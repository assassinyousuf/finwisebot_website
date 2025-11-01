<#
start-xampp.ps1

Helper to start/stop/check XAMPP MySQL from VS Code.

Usage:
  .\scripts\start-xampp.ps1 start
  .\scripts\start-xampp.ps1 stop
  .\scripts\start-xampp.ps1 status

Notes:
- The script will try common XAMPP locations and the 'mysql' service if installed.
- You may need to run VS Code as Administrator for Start/Stop to succeed.
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start','stop','status')]
    [string]$Action
)

function Find-XamppPath {
    # Check environment variable first
    if ($env:XAMPP_PATH -and (Test-Path $env:XAMPP_PATH)) { return $env:XAMPP_PATH }
    $candidates = @(
        "C:\\xampp",
        "C:\\Program Files\\xampp",
        "C:\\Program Files (x86)\\xampp"
    )
    foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
    return $null
}

$xampp = Find-XamppPath
if (-not $xampp) {
    Write-Host "Could not find XAMPP install automatically. Set XAMPP_PATH env var or run the control panel manually." -ForegroundColor Yellow
}

function Start-MySql {
    Write-Host "Starting MySQL..."
    # Prefer service if exists
    try {
        $svc = Get-Service -Name mysql -ErrorAction SilentlyContinue
        if ($svc) {
            if ($svc.Status -ne 'Running') { Start-Service mysql; Start-Sleep -Seconds 2 }
            Write-Host "Started Windows service 'mysql'." -ForegroundColor Green
            return
        }
    } catch {}

    if ($null -ne $xampp -and (Test-Path (Join-Path $xampp 'mysql' 'bin' 'mysqld.exe'))) {
        $mysqld = Join-Path $xampp 'mysql' 'bin' 'mysqld.exe'
        # Start a background process if not already running
        $existing = Get-Process -Name mysqld -ErrorAction SilentlyContinue
        if ($existing) { Write-Host "mysqld already running." -ForegroundColor Green; return }
        $myIni = Join-Path $xampp 'mysql' 'bin' 'my.ini'
        Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=\"$myIni\"" -WindowStyle Hidden
        Start-Sleep -Seconds 2
        Write-Host "Started mysqld from XAMPP path: $mysqld" -ForegroundColor Green
        return
    }

    Write-Host "Failed to start MySQL automatically. Please start XAMPP Control Panel and start MySQL manually." -ForegroundColor Red
}

function Stop-MySql {
    Write-Host "Stopping MySQL..."
    try {
        $svc = Get-Service -Name mysql -ErrorAction SilentlyContinue
        if ($svc) {
            if ($svc.Status -ne 'Stopped') { Stop-Service mysql -Force; Start-Sleep -Seconds 1 }
            Write-Host "Stopped Windows service 'mysql'." -ForegroundColor Green
            return
        }
    } catch {}

    $procs = Get-Process -Name mysqld -ErrorAction SilentlyContinue
    if ($procs) {
        $procs | Stop-Process -Force
        Write-Host "Stopped mysqld processes." -ForegroundColor Green
        return
    }

    Write-Host "MySQL does not appear to be running." -ForegroundColor Yellow
}

function Get-MySqlStatus {
    $svc = Get-Service -Name mysql -ErrorAction SilentlyContinue
    if ($svc) { Write-Host "Service mysql status: $($svc.Status)"; return }
    $procs = Get-Process -Name mysqld -ErrorAction SilentlyContinue
    if ($procs) { Write-Host "mysqld process running (PID: $($procs.Id))."; return }
    Write-Host "MySQL not running." -ForegroundColor Yellow
}

switch ($Action) {
    'start' { Start-MySql }
    'stop'  { Stop-MySql }
    'status' { Get-MySqlStatus }
}
