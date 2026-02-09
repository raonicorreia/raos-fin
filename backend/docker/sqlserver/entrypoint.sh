#!/bin/bash
set -e

# Sobe o SQL Server em background
/opt/mssql/bin/sqlservr &

echo "⏳ Aguardando SQL Server iniciar..."

# Aguarda o SQL Server ficar disponível
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1
do
  sleep 2
done

echo "✅ SQL Server pronto. Executando init.sql..."

# Executa script de inicialização
/opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -i /init.sql

wait
