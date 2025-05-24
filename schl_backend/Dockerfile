# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
