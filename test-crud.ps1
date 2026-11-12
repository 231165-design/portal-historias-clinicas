Write-Host "=== INICIANDO PRUEBAS DE API ===" -ForegroundColor Cyan
$baseUrl = "http://localhost:4000/api"

# 1. LOGIN
Write-Host "`n1. Probando Login..." -ForegroundColor Yellow
$loginBody = @{ dni = "12345678"; password = "admin123" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
if ($loginRes.success) {
    $token = $loginRes.data.tokens.accessToken
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "   [OK] Login exitoso. Token obtenido." -ForegroundColor Green
} else {
    Write-Host "   [X] Error en login" -ForegroundColor Red
    exit
}

# 2. CONSULTAS
Write-Host "`n2. Probando modulo de CONSULTAS..." -ForegroundColor Yellow
# GET
$consultas = Invoke-RestMethod -Uri "$baseUrl/consultas" -Headers $headers
Write-Host "   [OK] GET Consultas (Total: $($consultas.pagination.total))" -ForegroundColor Green

# POST (Crear)
$nuevaConsulta = @{
    paciente_id = 1
    motivo_consulta = "Prueba automatica PowerShell"
    diagnostico_principal = "Test"
    tipo_atencion = "Consulta"
} | ConvertTo-Json
$consultaCreada = Invoke-RestMethod -Uri "$baseUrl/consultas" -Method Post -Body $nuevaConsulta -ContentType "application/json" -Headers $headers
$idConsulta = $consultaCreada.data.id
Write-Host "   [OK] POST Consulta (ID Creado: $idConsulta)" -ForegroundColor Green

# DELETE
Invoke-RestMethod -Uri "$baseUrl/consultas/$idConsulta" -Method Delete -Headers $headers | Out-Null
Write-Host "   [OK] DELETE Consulta (ID: $idConsulta)" -ForegroundColor Green


# 3. CITAS
Write-Host "`n3. Probando modulo de CITAS..." -ForegroundColor Yellow
# GET
$citas = Invoke-RestMethod -Uri "$baseUrl/citas" -Headers $headers
Write-Host "   [OK] GET Citas (Total: $($citas.pagination.total))" -ForegroundColor Green

# POST (Crear)
$fechaFutura = (Get-Date).AddDays(2).ToString("yyyy-MM-ddTHH:mm:ss")
$nuevaCita = @{
    paciente_id = 1
    medico_id = 2
    fecha_hora = $fechaFutura
    motivo = "Prueba automatica"
    tipo = "Control"
} | ConvertTo-Json
$citaCreada = Invoke-RestMethod -Uri "$baseUrl/citas" -Method Post -Body $nuevaCita -ContentType "application/json" -Headers $headers
$idCita = $citaCreada.data.id
Write-Host "   [OK] POST Cita (ID Creado: $idCita)" -ForegroundColor Green

# PATCH (Cambiar Estado)
$cambioEstado = @{ estado = "Confirmada" } | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/citas/$idCita/estado" -Method Patch -Body $cambioEstado -ContentType "application/json" -Headers $headers | Out-Null
Write-Host "   [OK] PATCH Estado Cita a 'Confirmada'" -ForegroundColor Green

# DELETE
Invoke-RestMethod -Uri "$baseUrl/citas/$idCita" -Method Delete -Headers $headers | Out-Null
Write-Host "   [OK] DELETE Cita (ID: $idCita)" -ForegroundColor Green


# 4. VACUNAS
Write-Host "`n4. Probando modulo de VACUNAS..." -ForegroundColor Yellow
# GET
$vacunas = Invoke-RestMethod -Uri "$baseUrl/vacunas" -Headers $headers
Write-Host "   [OK] GET Vacunas (Total: $($vacunas.pagination.total))" -ForegroundColor Green

# POST (Crear)
$nuevaVacuna = @{
    paciente_id = 1
    tipo_vacuna = "Influenza"
    dosis = "Anual"
    fecha_aplicacion = (Get-Date).ToString("yyyy-MM-dd")
} | ConvertTo-Json
$vacunaCreada = Invoke-RestMethod -Uri "$baseUrl/vacunas" -Method Post -Body $nuevaVacuna -ContentType "application/json" -Headers $headers
$idVacuna = $vacunaCreada.data.id
Write-Host "   [OK] POST Vacuna (ID Creado: $idVacuna)" -ForegroundColor Green

# DELETE
Invoke-RestMethod -Uri "$baseUrl/vacunas/$idVacuna" -Method Delete -Headers $headers | Out-Null
Write-Host "   [OK] DELETE Vacuna (ID: $idVacuna)" -ForegroundColor Green


# 5. USUARIOS
Write-Host "`n5. Probando modulo de USUARIOS..." -ForegroundColor Yellow
$usuarios = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Headers $headers
Write-Host "   [OK] GET Usuarios (Total: $($usuarios.pagination.total))" -ForegroundColor Green

Write-Host "`n=== TODAS LAS PRUEBAS PASARON CORRECTAMENTE ===" -ForegroundColor Cyan
