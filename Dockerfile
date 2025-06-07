FROM node:latest

WORKDIR /app

COPY package*.json ./


RUN npm install -g node@11.4.1
RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production


FROM nginx:latest
WORKDIR /



COPY nginx.conf /etc/nginx/nginx.conf

COPY  dist/e-banking-front/browser /usr/share/nginx/html

EXPOSE 80
