# SmartPayMap Production Deployment Guide

This guide provides step-by-step instructions for deploying the SmartPayMap application on a Hetzner server.

## Prerequisites

1. A Hetzner Cloud server with Ubuntu installed
2. SSH access to your server
3. A domain name pointing to your server's IP address (via A records in Cloudflare or other DNS provider)
4. GitHub SSH key with access to your repository

## Deployment Steps

### 1. Connect to Your Server

```bash
ssh root@your-server-ip
```

### 2. Upload the Server Setup Script

Copy the `server-setup.sh` script to your server using SCP:

```bash
# Run this on your local machine
scp server-setup.sh root@your-server-ip:/root/
```

### 3. Make the Script Executable and Run

```bash
# On the server
chmod +x /root/server-setup.sh
sudo ./server-setup.sh
```

### 4. During the Installation, You Will Be Prompted for:

- GitHub repository URL (in SSH format: `git@github.com:username/repo.git`)
- Path to your GitHub SSH private key file
- Your domain name (e.g., `rayman.one`)
- A password for the `deploy` user
- Your public SSH key for server access

### 5. Verify the Installation

After the script completes, you should have:
- A running SmartPayMap application accessible via your domain
- HTTPS configured via Certbot/Let's Encrypt
- A secure `deploy` user for future deployments

To check the status of your application:

```bash
ssh deploy@your-server-ip
cd /app/smartpaymap
docker compose ps
```

## Security Features

The setup includes:
- Restricted SSH access (no root login, key-based authentication only)
- UFW firewall configured with only necessary ports open
- Fail2Ban for protection against brute force attacks
- HTTPS encryption using Let's Encrypt
- Non-root `deploy` user for operations

## Environment Configuration

Update your backend environment variables for production:

```bash
ssh deploy@your-server-ip
nano /app/smartpaymap/backend/.env
```

Make sure to update:
- API keys
- Set `DEBUG=False`
- Set `ENVIRONMENT=production`

## Updating the Application

To update your application after pushing changes to GitHub:

```bash
ssh deploy@your-server-ip
cd /app/smartpaymap
git pull
docker compose down
docker compose up -d
```

## Troubleshooting

### Logs

To view application logs:

```bash
# Frontend logs
docker compose logs frontend

# Backend logs
docker compose logs backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

1. **Application not accessible**:
   - Check Docker container status: `docker compose ps`
   - Verify Nginx configuration: `sudo nginx -t`
   - Check firewall settings: `sudo ufw status`

2. **SSL Certificate Issues**:
   - Run Certbot manually: `sudo certbot --nginx -d your-domain.com`

3. **Repository Access Problems**:
   - Verify SSH key permissions: `ls -la ~/.ssh`
   - Test GitHub connection: `ssh -T git@github.com`

## Maintenance

### Docker Cleanup

Periodically clean up unused Docker resources:

```bash
docker system prune -a
```

### SSL Certificate Renewal

SSL certificates will auto-renew. To manually trigger renewal:

```bash
sudo certbot renew
```

### Backup

Consider setting up regular backups of your environment files:

```bash
# Example backup script for environment files
mkdir -p ~/backups
cp /app/smartpaymap/backend/.env ~/backups/.env.backup-$(date +%Y%m%d)
``` 