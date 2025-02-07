# Fase 1: Construcción del proyecto
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --quiet

# Copiar el resto del código fuente
COPY . .

# Construir el proyecto
RUN npm run build

# Fase 2: Servir los archivos estáticos con Nginx
FROM nginx:alpine

# Copiar los archivos generados en la fase anterior al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx si existe
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80 para Nginx
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
