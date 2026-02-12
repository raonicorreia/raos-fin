#!/bin/bash

echo "Iniciando projeto RAOS Fin..."
echo

echo "1. Subindo containers Docker..."
cd backend
docker-compose up -d
echo

echo "2. Aguardando banco de dados ficar pronto..."
sleep 30
echo

echo "3. Iniciando backend Spring Boot..."
gnome-terminal -- mvn spring-boot:run &
echo "Backend iniciando..."
echo

echo "4. Aguardando backend iniciar..."
sleep 15
echo

echo "5. Iniciando frontend Angular..."
cd ../frontend
gnome-terminal -- ng serve &
echo "Frontend iniciando..."
echo

echo "Projeto iniciado com sucesso!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:4200"
echo
