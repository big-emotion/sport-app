FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Expo's default port
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the app
CMD ["npm", "start"]