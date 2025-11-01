<#
Create .env.local securely for local development.

This script will prompt you for either a full MongoDB connection string
or for the username / password / cluster parts and then write a safe
`.env.local` file in the project root. It intentionally DOES NOT store
credentials in the repository.

Do NOT commit `.env.local` to git.
#>

Param()

Write-Host "Creating .env.local file in the project root for FinWisebot..."
Write-Host "If the file already exists it will be overwritten."

$pwd = Get-Location
Write-Host "Project root: $pwd"

Write-Host "\nYou can either paste a full MongoDB connection string (recommended)," -ForegroundColor Cyan
Write-Host "or enter the username/password/cluster values and let this script build one." -ForegroundColor Cyan

$full = Read-Host -Prompt 'Paste full connection string (leave empty to enter components)'

if (![string]::IsNullOrWhiteSpace($full)) {
    # Basic validation
    if ($full -notmatch '^mongodb(\+srv)?:\/\/') {
        Write-Host "The provided string doesn't look like a valid MongoDB URI." -ForegroundColor Yellow
        $useFull = Read-Host -Prompt 'Use it anyway? (y/N)'
        if ($useFull -ne 'y') { Write-Host 'Aborting.'; exit 1 }
    }
    $mongo = $full
} else {
    $mongoUser = Read-Host -Prompt 'MongoDB username'
    # Read password as secure string and convert to plain for encoding
    $securePass = Read-Host -Prompt 'MongoDB password' -AsSecureString
    $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    try { $mongoPassPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }

    $cluster = Read-Host -Prompt 'MongoDB cluster host (e.g. cluster0.xyzabc.mongodb.net)'
    if ([string]::IsNullOrWhiteSpace($cluster)) { Write-Host 'Cluster host required.'; exit 1 }

    $database = Read-Host -Prompt 'Database name (default: finwisebot)'
    if ([string]::IsNullOrWhiteSpace($database)) { $database = 'finwisebot' }

    # URL-encode the password to handle special chars
    $encodedPass = [System.Uri]::EscapeDataString($mongoPassPlain)

    # Build SRV connection string (recommended for Atlas)
    $mongo = "mongodb+srv://$mongoUser:$encodedPass@$cluster/$database?retryWrites=true&w=majority"
}

# === JWT SECRET ===
$jwt = Read-Host -Prompt "Enter JWT_SECRET (leave empty to auto-generate a secure secret)"
if ([string]::IsNullOrWhiteSpace($jwt)) {
    $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
    $bytes = New-Object 'Byte[]' 32
    $rng.GetBytes($bytes)
    $jwt = [System.Convert]::ToBase64String($bytes)
    Write-Host "Generated JWT_SECRET: (hidden)" -ForegroundColor Green
}

# === WRITE TO .env.local ===
$envContent = @()
$envContent += "MONGODB_URI=$mongo"
$envContent += "MONGODB_DB=$database"
$envContent += "JWT_SECRET=$jwt"

$outPath = Join-Path $pwd '.env.local'

Write-Host "Writing .env.local to: $outPath"
[System.IO.File]::WriteAllLines($outPath, $envContent)

Write-Host "`n✅ Done! Your .env.local file has been created." -ForegroundColor Green
Write-Host "⚠️ Reminder: Do NOT commit this file to Git. Add it to your .gitignore." -ForegroundColor Yellow
Write-Host "If you previously exposed Atlas credentials (in chat or screenshots), rotate the user password in Atlas now and use the new password when running this script." -ForegroundColor Yellow
