#!/bin/bash
set -e

echo "========================================"
echo "SmartPayMap Server Update & Fix Script"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo: sudo ./update-server.sh"
  exit 1
fi

# Update the system
echo "1. Updating system packages..."
apt update && apt upgrade -y

# Fix Docker issues
echo -e "\n2. Fixing Docker service issues..."

# Stop Docker service
echo "   - Stopping Docker service..."
systemctl stop docker || true

# Install Docker dependencies that might be missing
echo "   - Installing additional dependencies..."
apt install -y \
  iptables \
  libseccomp2 \
  apparmor \
  ca-certificates \
  curl \
  gnupg

# Fix Docker runtime directories
echo "   - Setting up Docker runtime directories..."
mkdir -p /run/docker
chmod 711 /run/docker

# Fix Docker data directory if corrupted
if [ -d "/var/lib/docker" ]; then
  echo "   - Backing up existing Docker data..."
  mv /var/lib/docker /var/lib/docker.backup-$(date +%Y%m%d)
fi

# Reinstall Docker components
echo "   - Reinstalling Docker components..."
apt install --reinstall -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Reset Docker service
echo "   - Resetting Docker service..."
systemctl daemon-reload
systemctl enable docker
systemctl start docker

# Test Docker functionality
echo -e "\n3. Testing Docker..."
if ! docker run --rm hello-world; then
  echo "Docker test failed. More investigation needed."
  echo "Check logs with: journalctl -xeu docker.service"
else
  echo "Docker service is running correctly!"
fi

# Set up the application
echo -e "\n4. Setting up SmartPayMap application..."
mkdir -p /app
chown -R deploy:deploy /app 2>/dev/null || true

echo -e "\n5. Checking for pending kernel updates..."
needs_reboot=0

if [ -f /var/run/reboot-required ]; then
  needs_reboot=1
  echo "   - Kernel update is pending. Reboot required."
else
  echo "   - No pending kernel updates detected."
fi

echo -e "\nSetup complete!"
if [ $needs_reboot -eq 1 ]; then
  echo -e "\n========================================"
  echo "IMPORTANT: Your server needs a reboot to apply kernel updates."
  echo "Run the following command to reboot:"
  echo "sudo reboot"
  echo "========================================"
fi 