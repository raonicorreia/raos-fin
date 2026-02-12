@echo off
echo Iniciando projeto RAOS Fin...
echo.

echo 1. Subindo containers Docker...
cd backend
docker-compose up -d
echo.

echo 2. Aguardando banco de dados ficar pronto...
timeout /t 30 /nobreak >nul
echo.

echo 3. Iniciando backend Spring Boot...
start "Backend Spring Boot" cmd /k "mvn spring-boot:run"
echo.

echo 4. Aguardando backend iniciar...
timeout /t 15 /nobreak >nul
echo.

echo 5. Iniciando frontend Angular...
cd ..\frontend
start "Frontend Angular" cmd /k "ng serve"
echo.

echo Projeto iniciado com sucesso!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo.
pause
