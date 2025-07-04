#!/bin/bash
set -e

# =============================
# SmartPayMap Server Setup Script - Fixed Version
# Production configuration for Ubuntu on Hetzner
# =============================

echo "==============================================="
echo "SmartPayMap - Hetzner Server Setup (Fixed Version)"
echo "==============================================="

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo: sudo ./modified-server-setup.sh"
  exit 1
fi

# Get the GitHub repository URL
read -p "Enter GitHub repository URL (SSH format: git@github.com:username/repo.git): " REPO_URL
echo

# Ensure SSH key path is provided
read -p "Enter the path to your GitHub SSH private key file: " SSH_KEY_PATH
if [ ! -f "$SSH_KEY_PATH" ]; then
  echo "SSH key file not found at $SSH_KEY_PATH"
  exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., rayman.one): " DOMAIN_NAME
echo

echo "==============================================="
echo "1. System Update"
echo "==============================================="
apt update && apt upgrade -y

echo "==============================================="
echo "2. Installing Required Packages"
echo "==============================================="
apt install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  ufw \
  fail2ban \
  htop \
  tmux \
  vim \
  iptables \
  libseccomp2 \
  apparmor

echo "==============================================="
echo "3. Installing Docker & Docker Compose"
echo "==============================================="

# Remove any existing Docker installations
echo "Removing any existing Docker installations..."
apt-get remove -y docker docker-engine docker.io containerd runc || true

# Add Docker repository
echo "Adding Docker repository..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install Docker
echo "Installing Docker..."
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Create necessary directories with correct permissions
mkdir -p /run/docker
chmod 711 /run/docker

# Enable and start Docker service
echo "Enabling and starting Docker service..."
systemctl enable docker
systemctl start docker

# Verify Docker is running
if ! systemctl is-active --quiet docker; then
  echo "WARNING: Docker service failed to start. Will try to fix later..."
else
  echo "Docker service started successfully"
  # Test Docker
  docker run --rm hello-world || echo "Docker test failed but continuing with setup..."
fi

echo "==============================================="
echo "4. Creating Deploy User"
echo "==============================================="
# Create deploy user if it doesn't exist
if ! id -u deploy > /dev/null 2>&1; then
  useradd -m -s /bin/bash deploy
  # Add to Docker group
  usermod -aG docker deploy
  # Add to sudo group
  usermod -aG sudo deploy
  # Create password
  echo "Setting password for deploy user:"
  passwd deploy
fi

echo "==============================================="
echo "5. Setting up SSH Configuration"
echo "==============================================="
# Create .ssh directory for deploy user
mkdir -p /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys

# Copy your SSH public key to authorized_keys if provided
if [ -n "$SSH_KEY_PATH" ]; then
  cp "$SSH_KEY_PATH" /home/deploy/.ssh/id_rsa
  chmod 600 /home/deploy/.ssh/id_rsa
  ssh-keygen -y -f /home/deploy/.ssh/id_rsa > /home/deploy/.ssh/id_rsa.pub || true
fi

# Ask for authorized SSH key
read -p "Enter your public SSH key for server access (or press Enter to skip): " SSH_PUB_KEY
if [ -n "$SSH_PUB_KEY" ]; then
  echo "$SSH_PUB_KEY" >> /home/deploy/.ssh/authorized_keys
  echo "SSH key added to authorized_keys"
fi

# Secure SSH configuration
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Set proper permissions
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

echo "==============================================="
echo "6. Configuring Firewall"
echo "==============================================="
# Configure UFW (Uncomplicated Firewall)
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3000
ufw allow 8000
echo "y" | ufw enable

echo "==============================================="
echo "7. Setting up Application Directory"
echo "==============================================="
# Create application directory
mkdir -p /app
chown -R deploy:deploy /app

# Set up GitHub SSH for deploy user
mkdir -p /home/deploy/.ssh
cp "$SSH_KEY_PATH" /home/deploy/.ssh/id_rsa
chmod 600 /home/deploy/.ssh/id_rsa
chown deploy:deploy /home/deploy/.ssh/id_rsa

# Configure GitHub SSH access for deploy user
su - deploy << EOF
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/config
echo "Host github.com" > ~/.ssh/config
echo "  IdentityFile ~/.ssh/id_rsa" >> ~/.ssh/config
echo "  StrictHostKeyChecking no" >> ~/.ssh/config
chmod 600 ~/.ssh/config
ssh-keyscan github.com >> ~/.ssh/known_hosts
EOF

# Clone the repository
su - deploy << EOF
cd /app
if [ ! -d "/app/smartpaymap" ]; then
  echo "Cloning repository from $REPO_URL"
  git clone "$REPO_URL" /app/smartpaymap
else
  echo "Repository directory already exists, pulling latest changes"
  cd /app/smartpaymap
  git pull
fi

cd /app/smartpaymap

# Create environment file from example if it doesn't exist
if [ ! -f "backend/.env" ] && [ -f "backend/example.env" ]; then
  cp backend/example.env backend/.env
  echo "Created backend/.env from example file. Please update with production values."
fi

# Fix permissions
chmod +x docker-check.sh
EOF

echo "==============================================="
echo "8. Installing Nginx for Reverse Proxy"
echo "==============================================="
apt install -y nginx

# Create Nginx configuration for the app
cat > /etc/nginx/sites-available/$DOMAIN_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site configuration
ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config and restart
nginx -t && systemctl restart nginx

echo "==============================================="
echo "9. Installing Certbot for SSL"
echo "==============================================="
apt install -y certbot python3-certbot-nginx

# Set up auto-renewal
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | tee -a /etc/crontab > /dev/null

# Check for kernel updates
if [ -f /var/run/reboot-required ]; then
  echo "==============================================="
  echo "IMPORTANT: Kernel update is pending"
  echo "==============================================="
  echo "You should reboot the server before continuing: sudo reboot"
  echo "After reboot, run the final setup step with: sudo ./finish-setup.sh"
  
  # Create the finish-setup.sh script
  cat > /root/finish-setup.sh << 'FINISH'
#!/bin/bash
set -e

echo "==============================================="
echo "SmartPayMap - Finishing Setup"
echo "==============================================="

# Start the application
echo "Starting the SmartPayMap application..."
su - deploy << 'EOL'
cd /app/smartpaymap
docker compose down || true
docker compose up -d
EOL

# Set up SSL with Certbot
echo "Setting up SSL with Certbot..."
read -p "Enter your domain name: " DOMAIN_NAME
certbot --nginx --non-interactive --agree-tos -m "admin@$DOMAIN_NAME" -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" || echo "SSL setup failed. Run manually: certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"

echo "==============================================="
echo "Installation Complete!"
echo "==============================================="
echo "SmartPayMap has been set up on your server"
echo "Domain: $DOMAIN_NAME"
echo ""
echo "Next steps:"
echo "1. SSH to your server as the deploy user: ssh deploy@your-server-ip"
echo "2. Update the environment variables in /app/smartpaymap/backend/.env"
echo "3. Check application status: cd /app/smartpaymap && docker compose ps"
echo ""
echo "Your application should be accessible at: https://$DOMAIN_NAME"
echo "==============================================="
FINISH

  chmod +x /root/finish-setup.sh
  exit 0
else
  echo "==============================================="
  echo "10. Starting the Application"
  echo "==============================================="
  su - deploy << 'EOL'
  cd /app/smartpaymap
  docker compose down || true
  docker compose up -d
EOL

  echo "==============================================="
  echo "11. Setting up SSL with Certbot"
  echo "==============================================="
  certbot --nginx --non-interactive --agree-tos -m "admin@$DOMAIN_NAME" -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" || echo "SSL setup failed. Run manually: certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
fi

echo "==============================================="
echo "Installation Complete!"
echo "==============================================="
echo "SmartPayMap has been set up on your server"
echo "Domain: $DOMAIN_NAME"
echo ""
echo "Next steps:"
echo "1. SSH to your server as the deploy user: ssh deploy@your-server-ip"
echo "2. Update the environment variables in /app/smartpaymap/backend/.env"
echo "3. Check application status: cd /app/smartpaymap && docker compose ps"
echo ""
echo "Your application should be accessible at: https://$DOMAIN_NAME"
echo "===============================================" 