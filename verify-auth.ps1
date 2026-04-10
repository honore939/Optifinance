$body = '{"username":"admin","password":"password"}'
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $body -Headers @{ 'Content-Type' = 'application/json' } -UseBasicParsing
  Write-Output $r.Content
} catch {
  Write-Output $_.Exception.Message
}
