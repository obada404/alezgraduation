#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: node deploy-frontend.js <repo-url> <project-name> <port> [--branch <branch>] [--email <email>] [--docker] [--env <env-file>]');
  process.exit(1);
}

const repoUrl = args[0];
const projectName = args[1];
const port = args[2];

// Parse optional arguments
let branch = 'main';
let email = null;
let useDocker = false;
let envFile = null;

for (let i = 3; i < args.length; i++) {
  if (args[i] === '--branch' && args[i + 1]) {
    branch = args[i + 1];
    i++;
  } else if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  } else if (args[i] === '--docker') {
    useDocker = true;
  } else if (args[i] === '--env' && args[i + 1]) {
    envFile = args[i + 1];
    i++;
  }
}

const deployDir = `/var/www/${projectName}`;
const projectDir = join(deployDir, 'app');

console.log('🚀 Starting frontend deployment...');
console.log(`📦 Repository: ${repoUrl}`);
console.log(`📁 Project: ${projectName}`);
console.log(`🔌 Port: ${port}`);
console.log(`🌿 Branch: ${branch}`);
console.log(`🐳 Docker: ${useDocker ? 'Yes' : 'No'}`);

// Helper function to run commands
function runCommand(command, cwd = process.cwd()) {
  console.log(`\n▶️  Running: ${command}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: '/bin/bash'
    });
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    throw error;
  }
}

// Helper function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

try {
  // Create deployment directory
  console.log(`\n📁 Creating deployment directory: ${deployDir}`);
  if (!existsSync(deployDir)) {
    mkdirSync(deployDir, { recursive: true });
  }

  // Clone or update repository
  if (existsSync(projectDir)) {
    console.log(`\n🔄 Updating existing repository...`);
    runCommand(`git fetch origin ${branch}`, projectDir);
    runCommand(`git checkout ${branch}`, projectDir);
    runCommand(`git pull origin ${branch}`, projectDir);
  } else {
    console.log(`\n📥 Cloning repository...`);
    runCommand(`git clone -b ${branch} ${repoUrl} ${projectDir}`, deployDir);
  }

  // Setup environment file
  console.log(`\n⚙️  Setting up environment...`);
  const envPath = join(projectDir, '.env');
  
  if (envFile && existsSync(envFile)) {
    console.log(`📋 Copying environment file from ${envFile}`);
    const envContent = readFileSync(envFile, 'utf-8');
    writeFileSync(envPath, envContent);
  } else if (!existsSync(envPath)) {
    console.log(`📋 Creating default .env file...`);
    const defaultEnv = `VITE_API_BASE_URL=http://localhost:3000\n`;
    writeFileSync(envPath, defaultEnv);
    console.log(`⚠️  Please update .env file with your backend URL!`);
  }

  // Install dependencies
  console.log(`\n📦 Installing dependencies...`);
  if (!commandExists('npm')) {
    throw new Error('npm is not installed. Please install Node.js and npm.');
  }
  runCommand('npm install', projectDir);

  // Build the project
  console.log(`\n🔨 Building project...`);
  runCommand('npm run build', projectDir);

  const distDir = join(projectDir, 'dist');

  if (!existsSync(distDir)) {
    throw new Error('Build failed: dist directory not found');
  }

  if (useDocker) {
    // Docker deployment
    console.log(`\n🐳 Setting up Docker deployment...`);
    
    // Check if Docker is installed
    if (!commandExists('docker')) {
      throw new Error('Docker is not installed. Please install Docker first.');
    }

    // Create Dockerfile if it doesn't exist
    const dockerfilePath = join(projectDir, 'Dockerfile');
    if (!existsSync(dockerfilePath)) {
      console.log(`📝 Creating Dockerfile...`);
      const dockerfile = `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE ${port}

CMD ["nginx", "-g", "daemon off;"]
`;
      writeFileSync(dockerfile, dockerfile);
    }

    // Create nginx.conf if it doesn't exist
    const nginxConfPath = join(projectDir, 'nginx.conf');
    if (!existsSync(nginxConfPath)) {
      console.log(`📝 Creating nginx.conf...`);
      const nginxConf = `server {
    listen ${port};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`;
      writeFileSync(nginxConfPath, nginxConf);
    }

    // Create .dockerignore if it doesn't exist
    const dockerignorePath = join(projectDir, '.dockerignore');
    if (!existsSync(dockerignorePath)) {
      const dockerignore = `node_modules
dist
.git
.env.local
*.log
.DS_Store
`;
      writeFileSync(dockerignorePath, dockerignore);
    }

    // Build Docker image
    console.log(`\n🔨 Building Docker image...`);
    const imageName = `${projectName}:latest`;
    runCommand(`docker build -t ${imageName} .`, projectDir);

    // Stop and remove existing container if it exists
    try {
      runCommand(`docker stop ${projectName}`, deployDir);
      runCommand(`docker rm ${projectName}`, deployDir);
    } catch (e) {
      // Container doesn't exist, that's fine
    }

    // Run Docker container
    console.log(`\n🚀 Starting Docker container...`);
    runCommand(
      `docker run -d --name ${projectName} -p ${port}:${port} --restart unless-stopped ${imageName}`,
      deployDir
    );

    console.log(`\n✅ Deployment complete!`);
    console.log(`🌐 Application is running on port ${port}`);
    console.log(`📦 Container name: ${projectName}`);
    console.log(`\n📋 Useful commands:`);
    console.log(`   docker logs ${projectName} -f`);
    console.log(`   docker stop ${projectName}`);
    console.log(`   docker restart ${projectName}`);

  } else {
    // Non-Docker deployment using serve or nginx
    console.log(`\n🌐 Setting up web server...`);
    
    // Check if serve is installed, if not install it globally
    if (!commandExists('serve')) {
      console.log(`📦 Installing serve globally...`);
      runCommand('npm install -g serve');
    }

    // Create systemd service file
    const serviceName = `${projectName}.service`;
    const servicePath = `/etc/systemd/system/${serviceName}`;
    
    const serviceContent = `[Unit]
Description=${projectName} Frontend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${distDir}
ExecStart=/usr/bin/serve -s . -l ${port}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
`;

    console.log(`\n📝 Creating systemd service...`);
    writeFileSync(servicePath, serviceContent);

    // Reload systemd and start service
    console.log(`\n🔄 Reloading systemd...`);
    runCommand('systemctl daemon-reload');
    
    console.log(`\n🚀 Starting service...`);
    runCommand(`systemctl enable ${serviceName}`);
    runCommand(`systemctl restart ${serviceName}`);

    console.log(`\n✅ Deployment complete!`);
    console.log(`🌐 Application is running on port ${port}`);
    console.log(`📦 Service name: ${serviceName}`);
    console.log(`\n📋 Useful commands:`);
    console.log(`   systemctl status ${serviceName}`);
    console.log(`   systemctl restart ${serviceName}`);
    console.log(`   journalctl -u ${serviceName} -f`);
  }

  // Send email notification if email is provided
  if (email) {
    console.log(`\n📧 Sending deployment notification to ${email}...`);
    try {
      const subject = `Frontend Deployment Complete: ${projectName}`;
      const body = `Frontend deployment completed successfully!\n\nProject: ${projectName}\nPort: ${port}\nBranch: ${branch}\nDocker: ${useDocker ? 'Yes' : 'No'}`;
      runCommand(`echo "${body}" | mail -s "${subject}" ${email}`);
    } catch (e) {
      console.log(`⚠️  Could not send email notification. Make sure mail is configured.`);
    }
  }

  console.log(`\n🎉 All done!`);

} catch (error) {
  console.error(`\n❌ Deployment failed: ${error.message}`);
  process.exit(1);
}
