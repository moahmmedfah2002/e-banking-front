# Stage 1: Build Angular app
FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --output-path=dist/app

# Stage 2: Nginx server
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/app /usr/share/nginx/html

EXPOSE 80
