# --- Stage 1: Build the React App ---
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the production-ready static files
RUN npm run build

# --- Stage 2: Serve the Static Files with Nginx ---
FROM nginx:stable-alpine

# Copy the built files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# When the container starts, nginx will automatically serve the files
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]