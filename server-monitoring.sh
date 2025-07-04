#!/bin/bash

# SmartPayMap Server Monitoring Script
# -----------------------------------
# This script checks the health of various components of the SmartPayMap deployment
# Run this script on the server to get a quick status overview

# Text formatting
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

echo -e "${BOLD}SmartPayMap Server Monitoring${RESET}"
echo "========================================"
echo "Time: $(date)"
echo "Hostname: $(hostname)"

# Check system resources
echo -e "\n${BOLD}${BLUE}System Resources:${RESET}"
echo "--------------------------------------"
echo -e "${BOLD}Disk Usage:${RESET}"
df -h / | grep -v Filesystem

echo -e "\n${BOLD}Memory Usage:${RESET}"
free -h | grep -v total

echo -e "\n${BOLD}CPU Load:${RESET}"
uptime

# Check Docker status
echo -e "\n${BOLD}${BLUE}Docker Status:${RESET}"
echo "--------------------------------------"
if systemctl is-active --quiet docker; then
  echo -e "Docker Service: ${GREEN}Running${RESET}"
else
  echo -e "Docker Service: ${RED}Not Running${RESET}"
fi

# Check application containers
echo -e "\n${BOLD}${BLUE}Application Containers:${RESET}"
echo "--------------------------------------"
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker not installed${RESET}"
else
  if [ -d "/app/smartpaymap" ]; then
    cd /app/smartpaymap
    echo -e "${BOLD}Container Status:${RESET}"
    docker compose ps
    
    # Check containers are running
    FRONTEND_RUNNING=$(docker compose ps -q frontend | wc -l)
    BACKEND_RUNNING=$(docker compose ps -q backend | wc -l)
    
    if [ "$FRONTEND_RUNNING" -gt 0 ]; then
      echo -e "Frontend Container: ${GREEN}Running${RESET}"
    else
      echo -e "Frontend Container: ${RED}Not Running${RESET}"
    fi
    
    if [ "$BACKEND_RUNNING" -gt 0 ]; then
      echo -e "Backend Container: ${GREEN}Running${RESET}"
    else
      echo -e "Backend Container: ${RED}Not Running${RESET}"
    fi
  else
    echo -e "${YELLOW}Application directory not found at /app/smartpaymap${RESET}"
  fi
fi

# Check Nginx status
echo -e "\n${BOLD}${BLUE}Nginx Status:${RESET}"
echo "--------------------------------------"
if systemctl is-active --quiet nginx; then
  echo -e "Nginx Service: ${GREEN}Running${RESET}"
  
  # Check if config is valid
  if nginx -t &>/dev/null; then
    echo -e "Nginx Config: ${GREEN}Valid${RESET}"
  else
    echo -e "Nginx Config: ${RED}Invalid${RESET}"
    nginx -t
  fi
else
  echo -e "Nginx Service: ${RED}Not Running${RESET}"
fi

# Check SSL certificates
echo -e "\n${BOLD}${BLUE}SSL Certificates:${RESET}"
echo "--------------------------------------"
if command -v certbot &> /dev/null; then
  CERT_EXPIRY=$(certbot certificates 2>/dev/null | grep "Expiry Date" | head -1 | awk '{print $3, $4, $5, $6}')
  if [ -n "$CERT_EXPIRY" ]; then
    echo -e "Certificate Expiry: ${GREEN}$CERT_EXPIRY${RESET}"
    
    # Check if certificate will expire in less than 10 days
    EXPIRY_DATE=$(date -d "$CERT_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_DATE - CURRENT_DATE) / 86400 ))
    
    if [ $DAYS_LEFT -lt 10 ]; then
      echo -e "${YELLOW}Warning: SSL Certificate will expire in $DAYS_LEFT days${RESET}"
    fi
  else
    echo -e "${YELLOW}No SSL certificates found${RESET}"
  fi
else
  echo -e "${YELLOW}Certbot not installed${RESET}"
fi

# Check endpoint availability
echo -e "\n${BOLD}${BLUE}API Endpoints:${RESET}"
echo "--------------------------------------"
# Check backend health
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null)
if [ "$BACKEND_STATUS" == "200" ]; then
  echo -e "Backend Health Check: ${GREEN}OK (200)${RESET}"
else
  echo -e "Backend Health Check: ${RED}Failed ($BACKEND_STATUS)${RESET}"
fi

# Check frontend availability
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$FRONTEND_STATUS" == "200" ]; then
  echo -e "Frontend Availability: ${GREEN}OK (200)${RESET}"
else
  echo -e "Frontend Availability: ${RED}Failed ($FRONTEND_STATUS)${RESET}"
fi

# Check logs for errors
echo -e "\n${BOLD}${BLUE}Recent Error Logs:${RESET}"
echo "--------------------------------------"
echo -e "${BOLD}Nginx Errors:${RESET}"
sudo tail -n 5 /var/log/nginx/error.log 2>/dev/null || echo "No Nginx error logs found"

if [ -d "/app/smartpaymap" ]; then
  echo -e "\n${BOLD}Docker Logs (Last 5 lines):${RESET}"
  cd /app/smartpaymap
  echo -e "\n${BOLD}Backend Errors:${RESET}"
  docker compose logs --tail 5 backend 2>/dev/null || echo "No backend logs found"
  
  echo -e "\n${BOLD}Frontend Errors:${RESET}"
  docker compose logs --tail 5 frontend 2>/dev/null || echo "No frontend logs found"
fi

echo -e "\n${BOLD}${BLUE}Security:${RESET}"
echo "--------------------------------------"
echo -e "${BOLD}Firewall Status:${RESET}"
sudo ufw status verbose | grep Status

echo -e "\n${BOLD}Failed SSH Attempts (Last 5):${RESET}"
sudo grep "Failed password" /var/log/auth.log 2>/dev/null | tail -5 || echo "No failed SSH attempts found"

echo -e "\n${BOLD}${BLUE}System Updates:${RESET}"
echo "--------------------------------------"
UPDATES=$(apt list --upgradable 2>/dev/null | grep -v "Listing..." | wc -l)
if [ "$UPDATES" -gt 0 ]; then
  echo -e "${YELLOW}$UPDATES packages can be upgraded${RESET}"
else
  echo -e "${GREEN}System is up to date${RESET}"
fi

echo -e "\n========================================"
echo "Monitoring complete"
echo -e "Run 'chmod +x server-monitoring.sh && ./server-monitoring.sh' for future checks"
echo -e "For detailed logs: 'docker compose logs'"
echo "========================================" 