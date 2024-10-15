# Use Node 20.17.0 as the base image
FROM node:20.17.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
