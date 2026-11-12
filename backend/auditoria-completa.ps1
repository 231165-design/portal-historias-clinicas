Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  AUDITORIA COMPLETA DE LA API REST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000/api"
$results = @()

function Test-Endpoint {
    param($name, $url, $method = "GET", $headers, $body = $null)
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            ContentType = "application/json"
        }
        if ($body) { $params.Body = $body }
        
        $res = Invoke-RestMethod @params
        Write-Host "  [OK] $name" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  [X] $name -> $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# 1. LOGIN
Write-Host "`n[1] AUTENTICACION" -ForegroundColor Yellow
$loginBody = @{ dni = "12345678"; password = "admin123" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.tokens.accessToken
$headers = @{ Authorization = "Bearer $token" }
Write-Host "  [OK] Login exitoso" -ForegroundColor Green
Write-Host "  Token: $($token.Substring(0, 30))..." -ForegroundColor Gray

# 2. HEALTH
Write-Host "`n[2] HEALTH CHECK" -ForegroundColor Yellow
Test-Endpoint "GET /health" "$baseUrl/health"

# 3. PACIENTES
Write-Host "`n[3] PACIENTES" -ForegroundColor Yellow
Test-Endpoint "GET /pacientes" "$baseUrl/pacientes" -headers $headers
Test-Endpoint "GET /pacientes/stats" "$baseUrl/pacientes/stats" -headers $headers
Test-Endpoint "GET /pacientes/1" "$baseUrl/pacientes/1" -headers $headers
Test-Endpoint "GET /pacientes/1/consultas" "$baseUrl/pacientes/1/consultas" -headers $headers
Test-Endpoint "GET /pacientes/1/vacunas" "$baseUrl/pacientes/1/vacunas" -headers $headers

# 4. CONSULTAS
Write-Host "`n[4] CONSULTAS" -ForegroundColor Yellow
Test-Endpoint "GET /consultas" "$baseUrl/consultas" -headers $headers
Test-Endpoint "GET /consultas/stats" "$baseUrl/consultas/stats" -headers $headers
Test-Endpoint "GET /consultas/1" "$baseUrl/consultas/1" -headers $headers
Test-Endpoint "GET /consultas/paciente/1" "$baseUrl/consultas/paciente/1" -headers $headers

# 5. CITAS
Write-Host "`n[5] CITAS" -ForegroundColor Yellow
Test-Endpoint "GET /citas" "$baseUrl/citas" -headers $headers
Test-Endpoint "GET /citas/stats" "$baseUrl/citas/stats" -headers $headers
Test-Endpoint "GET /citas/1" "$baseUrl/citas/1" -headers $headers

# 6. VACUNAS
Write-Host "`n[6] VACUNAS" -ForegroundColor Yellow
Test-Endpoint "GET /vacunas" "$baseUrl/vacunas" -headers $headers
Test-Endpoint "GET /vacunas/stats" "$baseUrl/vacunas/stats" -headers $headers
Test-Endpoint "GET /vacunas/1" "$baseUrl/vacunas/1" -headers $headers
Test-Endpoint "GET /vacunas/paciente/1" "$baseUrl/vacunas/paciente/1" -headers $headers

# 7. USUARIOS
Write-Host "`n[7] USUARIOS" -ForegroundColor Yellow
Test-Endpoint "GET /usuarios" "$baseUrl/usuarios" -headers $headers
Test-Endpoint "GET /usuarios/1" "$baseUrl/usuarios/1" -headers $headers

# 8. DASHBOARD
Write-Host "`n[8] DASHBOARD" -ForegroundColor Yellow
Test-Endpoint "GET /dashboard/stats" "$baseUrl/dashboard/stats" -headers $headers
Test-Endpoint "GET /dashboard/charts" "$baseUrl/dashboard/charts" -headers $headers
Test-Endpoint "GET /dashboard/actividad" "$baseUrl/dashboard/actividad" -headers $headers
Test-Endpoint "GET /dashboard/resumen" "$baseUrl/dashboard/resumen" -headers $headers

# 9. SEGURIDAD (Rutas protegidas)
Write-Host "`n[9] SEGURIDAD (Rutas protegidas)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/pacientes" -Method Get -ErrorAction Stop
    Write-Host "  [X] /pacientes es accesible SIN token (MAL)" -ForegroundColor Red
} catch {
    Write-Host "  [OK] /pacientes requiere token (BIEN)" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  AUDITORIA COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
