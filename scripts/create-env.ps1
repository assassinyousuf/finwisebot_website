<#
Create .env.local securely for local development.

This script will prompt you for your MongoDB Atlas connection string (MONGODB_URI).
It will optionally generate a strong JWT_SECRET for you if you don't provide one.

Do NOT commit .env.local to git. This script writes a file in the project root.
#>

Param()

function Read-SecureStringPlain {
    param([string]$prompt)
    $ss = Read-Host -Prompt $prompt -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ss)
    try { [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

Write-Host "This will create a local .env.local file in the project root. It will NOT be committed."
Write-Host "If the file already exists it will be overwritten."

$pwd = Get-Location
Write-Host "Project root: $pwd"

$mongo = Read-SecureStringPlain -prompt "Enter your MongoDB connection string (MONGODB_URI). Example: mongodb+srv://user:pass@cluster0..."
if ([string]::IsNullOrWhiteSpace($mongo)) {
    Write-Host "No MongoDB URI provided — exiting." -ForegroundColor Yellow
    exit 1
}

$jwt = Read-Host -Prompt "Enter JWT_SECRET (leave empty to auto-generate a secure secret)"
if ([string]::IsNullOrWhiteSpace($jwt)) {
    # generate 64-char hex secret
    $rand = -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Minimum 0 -Maximum 256) })
    $jwt = $rand
    Write-Host "Generated JWT_SECRET: $jwt" -ForegroundColor Green
}

$envContent = @()
$envContent += "MONGODB_URI=$mongo"
$envContent += "MONGODB_DB=finwisebot"
$envContent += "JWT_SECRET=$jwt"

$outPath = Join-Path $pwd '.env.local'

Write-Host "Writing .env.local to: $outPath"
[System.IO.File]::WriteAllLines($outPath, $envContent)

Write-Host "Done. Please DO NOT commit .env.local to git. Add it to your .gitignore if necessary." -ForegroundColor Cyan
