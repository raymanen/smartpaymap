#!/bin/bash
set -e

echo "========================================"
echo "Docker Service Fix Script"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo: sudo ./fix-docker.sh"
  exit 1
fi

echo "Checking Docker service status..."
systemctl status docker || true

echo -e "\nChecking Docker service logs..."
journalctl -xeu docker.service --no-pager | tail -n 30 || true

echo -e "\n1. Stopping Docker service..."
systemctl stop docker || true

echo "2. Checking kernel..."
uname -a
echo "Note: A kernel upgrade is pending. You should reboot after fixing Docker."

echo -e "\n3. Checking Docker data directory..."
ls -la /var/lib/docker || true

echo -e "\n4. Verifying Docker runtime directory permissions..."
mkdir -p /run/docker
chmod 711 /run/docker

echo -e "\n5. Checking if Docker socket exists..."
ls -la /var/run/docker.sock || true

echo -e "\n6. Applying common fixes..."

# Remove any potentially corrupted Docker data
echo "6.1. Backing up Docker data directory..."
if [ -d "/var/lib/docker" ]; then
  mv /var/lib/docker /var/lib/docker.bak
fi

# Reinstall Docker
echo "6.2. Reinstalling Docker..."
apt-get update
apt-get install --reinstall -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable and start Docker
echo -e "\n7. Enabling and starting Docker service..."
systemctl enable docker
systemctl start docker

# Check if Docker is running
echo -e "\n8. Verifying Docker service status..."
if systemctl is-active --quiet docker; then
  echo "SUCCESS: Docker service is now running!"
  
  # Test Docker functionality
  echo -e "\n9. Testing Docker with hello-world container..."
  docker run --rm hello-world
else
  echo "ERROR: Docker service is still not running."
  echo "Additional troubleshooting steps:"
  echo " - Reboot the server to apply kernel updates: sudo reboot"
  echo " - Check if apparmor is causing issues: sudo aa-status"
  echo " - Check disk space: df -h"
  echo " - Review full logs: sudo journalctl -xeu docker.service"
fi

echo -e "\nIMPORTANT: After fixing Docker, reboot your server to apply the pending kernel update."
echo "Run: sudo reboot" 