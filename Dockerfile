# Start from official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for layer caching — faster rebuilds)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the app
COPY src/ ./src/

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "src/app.js"]