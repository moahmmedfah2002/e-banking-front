# Build stage
FROM node:latest AS builder

WORKDIR /app

# First copy only package files for better caching
COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli

# Copy all other files
COPY . .

# Build Angular with explicit output path
RUN ng build --configuration production --output-path=dist/app

# Production stage
FROM nginx:latest

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/dist/app /usr/share/nginx/html

EXPOSE 80
