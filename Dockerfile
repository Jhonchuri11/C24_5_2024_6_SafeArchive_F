# Usa una imagen base de Node.js
FROM node:20

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .


# Construye la aplicación para producción
RUN npm run build

# Instala serve para servir la aplicación
RUN npm install -g serve

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]