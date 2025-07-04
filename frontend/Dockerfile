# Frontend Dockerfile - Multi-stage build
# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
# This layer is cached unless package files change
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application - using build-docker script that ignores TypeScript errors
RUN npm run build-docker

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check to verify nginx is running properly
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

# Command to run nginx in foreground
CMD ["nginx", "-g", "daemon off;"] 