$body = '{"username":"admin","password":"password"}'
try {
  $auth = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -Headers @{ 'Content-Type' = 'application/json' } -UseBasicParsing
  $token = (ConvertFrom-Json $auth.Content).token
  if (-not $token) { throw 'No token returned' }
  $marks = Invoke-WebRequest -Uri 'http://localhost:5000/api/marks' -Headers @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' } -UseBasicParsing
  Write-Output $marks.Content
} catch {
  Write-Output $_.Exception.Message
}
