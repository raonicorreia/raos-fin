const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando projeto RAOS Fin...');
console.log('');

// Função para executar comandos
function runCommand(command, args, cwd, description) {
    return new Promise((resolve, reject) => {
        console.log(`1. ${description}...`);
        
        const process = spawn(command, args, {
            cwd: cwd,
            stdio: 'inherit'
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                console.log(`${description} concluído com sucesso!`);
                resolve();
            } else {
                console.error(`${description} falhou com código ${code}`);
                reject(new Error(`${description} falhou`));
            }
        });
        
        process.on('error', (error) => {
            console.error(`Erro ao executar ${description}:`, error);
            reject(error);
        });
    });
}

// Função para iniciar processos em background
function startBackgroundProcess(command, args, cwd, description) {
    console.log(`${description}...`);
    
    const process = spawn(command, args, {
        cwd: cwd,
        detached: true,
        stdio: 'ignore'
    });
    
    process.unref();
    console.log(`${description} iniciado em background!`);
}

async function startProject() {
    try {
        const projectRoot = __dirname;
        const backendDir = path.join(projectRoot, 'backend');
        const frontendDir = path.join(projectRoot, 'frontend');
        
        // 1. Subir containers Docker
        await runCommand('docker-compose', ['up', '-d'], backendDir, 'Subindo containers Docker');
        
        // 2. Aguardar banco de dados
        console.log('2. Aguardando banco de dados ficar pronto...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // 3. Iniciar backend
        startBackgroundProcess('mvn', ['spring-boot:run'], backendDir, '3. Iniciando backend Spring Boot');
        
        // 4. Aguardar backend
        console.log('4. Aguardando backend iniciar...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        // 5. Iniciar frontend
        startBackgroundProcess('ng', ['serve'], frontendDir, '5. Iniciando frontend Angular');
        
        console.log('');
        console.log('Projeto iniciado com sucesso!');
        console.log('Backend: http://localhost:8080');
        console.log('Frontend: http://localhost:4200');
        console.log('');
        console.log('Para parar os serviços, use: npm run docker:down');
        
    } catch (error) {
        console.error('Erro ao iniciar o projeto:', error.message);
        process.exit(1);
    }
}

startProject();
