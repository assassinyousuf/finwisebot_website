<#
Fix Node/NVM PATH helper

This script searches common install locations for nvm and node (nvm-windows and Node.js MSI locations).
If found, it will add the directories to the current user's PATH (User environment variable) so new shells can see them.

Usage (run in PowerShell as your normal user):
  Set-Location -LiteralPath 'E:\finwisebot_website\scripts'
  .\fix-node-path.ps1

After running, close and re-open PowerShell and run `nvm use 18.20.0` then `node -v` and `npm -v`.
#>

Write-Host "Searching for nvm/node common install locations..."

$candidates = @(
  'C:\Program Files\nvm',
  'C:\Program Files\nodejs',
  "$env:LOCALAPPDATA\nvm",
  "$env:LOCALAPPDATA\nodejs",
  "$env:USERPROFILE\AppData\Roaming\nvm",
  "$env:USERPROFILE\AppData\Local\Programs\nodejs",
  "$env:USERPROFILE\AppData\Roaming\npm",
  'C:\Program Files (x86)\nodejs'
)

$found = @()
foreach ($p in $candidates) {
  if ([string]::IsNullOrEmpty($p)) { continue }
  try {
    if (Test-Path $p) {
      $found += (Get-Item $p).FullName
    }
  } catch {
    # ignore
  }
}

if ($found.Count -eq 0) {
  Write-Warning "No common nvm/node folders found. Please run 'where.exe nvm' or 'where.exe node' in the shell where nvm works and paste the path here."
  return
}

Write-Host "Found the following candidate folders:" -ForegroundColor Cyan
$found | ForEach-Object { Write-Host " - $_" }

$userPath = [Environment]::GetEnvironmentVariable('PATH','User')
if ($null -eq $userPath) { $userPath = '' }

$toAdd = @()
foreach ($f in $found) {
  if ($userPath -notlike "*${f}*") { $toAdd += $f }
}

if ($toAdd.Count -eq 0) {
  Write-Host "All candidate folders are already present in the user PATH." -ForegroundColor Green
  Write-Host "You still need to open a new PowerShell and run: `nvm use 18.20.0`" -ForegroundColor Yellow
  return
}

$newPath = $userPath
if (-not [string]::IsNullOrEmpty($newPath) -and -not $newPath.EndsWith(';')) { $newPath += ';' }
$newPath += ($toAdd -join ';')

try {
  [Environment]::SetEnvironmentVariable('PATH', $newPath, 'User')
  Write-Host "Added to user PATH:" -ForegroundColor Green
  $toAdd | ForEach-Object { Write-Host " - $_" }
  Write-Host "Important: Close and re-open your PowerShell/VS Code terminal so the new PATH is applied." -ForegroundColor Yellow
  Write-Host "Then run: nvm use 18.20.0 ; node -v ; npm -v" -ForegroundColor Cyan
} catch {
  Write-Error "Failed to update user PATH: $_"
}
