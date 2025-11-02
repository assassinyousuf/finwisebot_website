# 1) Put your full URI here (what you gave me)
$uri = 'mongodb+srv://itsmeyousuf_db_user:rCDQxoqZEfd579wn@cluster0.l9yaovj.mongodb.net/?appName=Cluster0'

# 2) Generate a strong JWT_SECRET
$bytes = New-Object 'Byte[]' 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$jwt = [Convert]::ToBase64String($bytes)

# 3) Build .env.local content (set MONGODB_DB to the DB name you want)
$envContent = @(
  "MONGODB_URI=$uri",
  "MONGODB_DB=finwisebot",
  "JWT_SECRET=$jwt"
)

# 4) Write .env.local (UTF8)
$envContent | Out-File -FilePath .\.env.local -Encoding utf8 -Force

Write-Host "Wrote .env.local to: $PWD\.env.local" -ForegroundColor Green