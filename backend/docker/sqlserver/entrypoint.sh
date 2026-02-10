#!/bin/bash
set -e

echo "🚀 Iniciando SQL Server..."

# Inicia o SQL Server em background
/opt/mssql/bin/sqlservr &

echo "⏳ Aguardando SQL Server iniciar..."

# Aguarda o SQL Server ficar disponível
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1
do
  sleep 2
done

echo "✅ SQL Server pronto. Executando init.sql..."

# Executa script de inicialização se existir
if [ -f /init.sql ]; then
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -i /init.sql
  echo "🎉 Script init.sql executado com sucesso!"
else
  echo "⚠️ Arquivo init.sql não encontrado"
fi

# Mantém o container rodando
wait

# docker exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "raos@1234" -Q "IF DB_ID('Raos_Fin') IS NULL CREATE DATABASE Raos_Fin"
