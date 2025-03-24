# Utiliser l'image officielle de Node.js 22
FROM node:22

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'API
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"]
